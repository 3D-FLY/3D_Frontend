package com.threedfly.partners.service;

import com.threedfly.partners.entity.Partner;
import com.threedfly.partners.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Partner administration (admin portal). Trimmed port of the legacy
 * SupplierService — same behaviors, records instead of ModelMapper ceremony.
 * If a partner is created without coordinates but with an address, we geocode
 * once at write time so routing never has to.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PartnerService {

    private final PartnerRepository partners;
    private final GeocodingService geocoding;

    public record PartnerRequest(Long userId, String name, String email, String phone, String address,
                                 String city, String state, String country, String postalCode,
                                 Double latitude, Double longitude, String description) {}

    public List<Partner> findAll() {
        return partners.findAll();
    }

    public Partner findById(Long id) {
        return partners.findById(id).orElseThrow(() -> new PartnerNotFoundException(id));
    }

    public List<Partner> findRoutable() {
        return partners.findRoutable();
    }

    public Partner create(PartnerRequest req) {
        if (partners.existsByEmail(req.email())) {
            throw new DuplicatePartnerException("email " + req.email());
        }
        if (req.userId() != null && partners.existsByUserId(req.userId())) {
            throw new DuplicatePartnerException("userId " + req.userId());
        }
        Partner partner = Partner.builder()
                .userId(req.userId())
                .name(req.name())
                .email(req.email())
                .phone(req.phone())
                .address(req.address())
                .city(req.city())
                .state(req.state())
                .country(req.country())
                .postalCode(req.postalCode())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .description(req.description())
                .verified(false)
                .active(true)
                .build();
        enrichCoordinatesIfMissing(partner);
        Partner saved = partners.save(partner);
        log.info("Created partner {} ({})", saved.getId(), saved.getName());
        return saved;
    }

    public Partner update(Long id, PartnerRequest req) {
        Partner partner = findById(id);
        if (!partner.getEmail().equals(req.email()) && partners.existsByEmail(req.email())) {
            throw new DuplicatePartnerException("email " + req.email());
        }
        partner.setUserId(req.userId());
        partner.setName(req.name());
        partner.setEmail(req.email());
        partner.setPhone(req.phone());
        partner.setAddress(req.address());
        partner.setCity(req.city());
        partner.setState(req.state());
        partner.setCountry(req.country());
        partner.setPostalCode(req.postalCode());
        partner.setLatitude(req.latitude());
        partner.setLongitude(req.longitude());
        partner.setDescription(req.description());
        enrichCoordinatesIfMissing(partner);
        return partners.save(partner);
    }

    public Partner setVerified(Long id, boolean verified) {
        Partner partner = findById(id);
        partner.setVerified(verified);
        log.info("Partner {} verified={}", id, verified);
        return partners.save(partner);
    }

    public Partner setActive(Long id, boolean active) {
        Partner partner = findById(id);
        partner.setActive(active);
        log.info("Partner {} active={}", id, active);
        return partners.save(partner);
    }

    public void delete(Long id) {
        partners.delete(findById(id));
    }

    private void enrichCoordinatesIfMissing(Partner partner) {
        if (partner.getLatitude() != null && partner.getLongitude() != null) {
            return;
        }
        StringBuilder q = new StringBuilder();
        for (String part : new String[]{partner.getAddress(), partner.getCity(), partner.getState(),
                partner.getPostalCode(), partner.getCountry()}) {
            if (part != null && !part.isBlank()) {
                if (!q.isEmpty()) q.append(", ");
                q.append(part.trim());
            }
        }
        geocoding.geocode(q.toString()).ifPresentOrElse(p -> {
            partner.setLatitude(p.latitude());
            partner.setLongitude(p.longitude());
        }, () -> log.warn("Partner '{}' has no coordinates and geocoding failed — not routable until fixed",
                partner.getName()));
    }

    public static class PartnerNotFoundException extends RuntimeException {
        public PartnerNotFoundException(Long id) {
            super("Partner not found with ID: " + id);
        }
    }

    public static class DuplicatePartnerException extends RuntimeException {
        public DuplicatePartnerException(String what) {
            super("Partner already exists with " + what);
        }
    }
}
