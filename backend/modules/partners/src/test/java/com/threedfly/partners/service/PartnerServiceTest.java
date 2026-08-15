package com.threedfly.partners.service;

import com.threedfly.partners.entity.Partner;
import com.threedfly.partners.repository.PartnerRepository;
import com.threedfly.partners.service.PartnerService.PartnerRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PartnerServiceTest {

    @Autowired private PartnerService service;
    @Autowired private PartnerRepository partners;

    @BeforeEach
    void clean() {
        partners.deleteAll();
    }

    private PartnerRequest request(String email, Double lat, Double lon) {
        return new PartnerRequest(null, "Studio X", email, "050-000", "Herzl 1",
                "Tel Aviv", null, "Israel", "12345", lat, lon, "FDM studio");
    }

    @Test
    @DisplayName("Create with coordinates: partner starts active, unverified, not yet routable")
    void createDefaults() {
        Partner p = service.create(request("a@x.com", 32.08, 34.78));

        assertTrue(p.isActive());
        assertFalse(p.isVerified());
        assertTrue(service.findRoutable().isEmpty(), "unverified partner must not be routable");

        service.setVerified(p.getId(), true);
        assertEquals(1, service.findRoutable().size());
    }

    @Test
    @DisplayName("Create without coordinates and unreachable geocoder: saved but not routable")
    void createWithoutCoordinates() {
        Partner p = service.create(request("a@x.com", null, null));
        service.setVerified(p.getId(), true);

        assertNull(p.getLatitude());
        assertTrue(service.findRoutable().isEmpty(), "no coordinates → not routable");
    }

    @Test
    @DisplayName("Duplicate email is rejected")
    void duplicateEmail() {
        service.create(request("a@x.com", 1.0, 1.0));
        assertThrows(PartnerService.DuplicatePartnerException.class,
                () -> service.create(request("a@x.com", 2.0, 2.0)));
    }

    @Test
    @DisplayName("Deactivate removes partner from the routable pool")
    void deactivateRemovesFromPool() {
        Partner p = service.create(request("a@x.com", 1.0, 1.0));
        service.setVerified(p.getId(), true);
        assertEquals(1, service.findRoutable().size());

        service.setActive(p.getId(), false);
        assertTrue(service.findRoutable().isEmpty());
    }

    @Test
    @DisplayName("Update changes fields and keeps uniqueness check")
    void updateFields() {
        Partner p = service.create(request("a@x.com", 1.0, 1.0));
        service.create(request("b@x.com", 1.0, 1.0));

        Partner updated = service.update(p.getId(), request("a2@x.com", 3.0, 4.0));
        assertEquals("a2@x.com", updated.getEmail());
        assertEquals(3.0, updated.getLatitude());

        assertThrows(PartnerService.DuplicatePartnerException.class,
                () -> service.update(p.getId(), request("b@x.com", 1.0, 1.0)));
    }

    @Test
    @DisplayName("Unknown id throws PartnerNotFoundException")
    void unknownId() {
        assertThrows(PartnerService.PartnerNotFoundException.class, () -> service.findById(404L));
    }
}
