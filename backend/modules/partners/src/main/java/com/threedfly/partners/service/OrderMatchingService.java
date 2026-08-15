package com.threedfly.partners.service;

import com.threedfly.orders.entity.Order;
import com.threedfly.orders.entity.OrderLedgerEntry.ActorType;
import com.threedfly.orders.entity.OrderStatus;
import com.threedfly.orders.service.OrderService;
import com.threedfly.partners.entity.Partner;
import com.threedfly.partners.repository.PartnerRepository;
import com.threedfly.partners.service.GeocodingService.GeoPoint;
import com.threedfly.partners.util.DistanceCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Alpha matcher: nearest routable partner by great-circle distance (MVP scope:
 * "basic routing + fallback + admin override is enough"). Orders it can't
 * place stay where they are for the admin to resolve.
 *
 * Also performs the RECEIVED→PRICED step as an explicit pass-through until the
 * quotation engine is wired into the order flow — the ledger says so honestly.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderMatchingService {

    private final OrderService orderService;
    private final PartnerRepository partners;
    private final ShippingAddressExtractor addressExtractor;

    /** Matches all RECEIVED orders and re-matches REJECTED ones. Returns orders matched. */
    public int processPending() {
        int matched = 0;
        for (Order order : orderService.findByStatus(OrderStatus.RECEIVED)) {
            if (matchNew(order)) matched++;
        }
        for (Order order : orderService.findByStatus(OrderStatus.REJECTED)) {
            if (rematch(order)) matched++;
        }
        return matched;
    }

    private boolean matchNew(Order order) {
        Optional<Partner> partner = nearestPartner(order, null);
        if (partner.isEmpty()) {
            return false;
        }
        orderService.transition(order.getId(), OrderStatus.PRICED, ActorType.SYSTEM, null,
                "Alpha pass-through: quotation engine not yet wired into order flow");
        assignAndLog(order, partner.get());
        return true;
    }

    private boolean rematch(Order order) {
        // exclude the partner that rejected it
        Optional<Partner> partner = nearestPartner(order, order.getPartnerId());
        if (partner.isEmpty()) {
            log.warn("Order {} rejected by partner {} and no alternative partner available — awaiting admin",
                    order.getId(), order.getPartnerId());
            return false;
        }
        assignAndLog(order, partner.get());
        return true;
    }

    private void assignAndLog(Order order, Partner partner) {
        Double distance = distanceTo(order, partner).orElse(null);
        String reason = distance != null
                ? "Matched to nearest partner '%s' (%.1f km)".formatted(partner.getName(), distance)
                : "Matched to partner '%s'".formatted(partner.getName());
        orderService.matchToPartner(order.getId(), partner.getId(), reason);
        log.info("Order {} matched to partner {} ({})", order.getId(), partner.getId(), partner.getName());
    }

    private Optional<Partner> nearestPartner(Order order, Long excludePartnerId) {
        List<Partner> pool = partners.findRoutable().stream()
                .filter(p -> !Objects.equals(p.getId(), excludePartnerId))
                .toList();
        if (pool.isEmpty()) {
            log.warn("No routable partners (active+verified+coordinates) — order {} waits", order.getId());
            return Optional.empty();
        }

        Optional<GeoPoint> buyer = addressExtractor.resolveCoordinates(order.getShippingAddressJson());
        if (buyer.isEmpty()) {
            log.warn("Order {} has no resolvable buyer coordinates — cannot match", order.getId());
            return Optional.empty();
        }

        return pool.stream().min(Comparator.comparingDouble(p ->
                DistanceCalculator.calculateDistance(
                        buyer.get().latitude(), buyer.get().longitude(),
                        p.getLatitude(), p.getLongitude())));
    }

    private Optional<Double> distanceTo(Order order, Partner partner) {
        return addressExtractor.resolveCoordinates(order.getShippingAddressJson())
                .map(b -> DistanceCalculator.roundDistance(DistanceCalculator.calculateDistance(
                        b.latitude(), b.longitude(), partner.getLatitude(), partner.getLongitude()), 1));
    }
}
