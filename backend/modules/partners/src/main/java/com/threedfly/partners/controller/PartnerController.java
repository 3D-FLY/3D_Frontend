package com.threedfly.partners.controller;

import com.threedfly.partners.entity.Partner;
import com.threedfly.partners.service.PartnerService;
import com.threedfly.partners.service.PartnerService.PartnerRequest;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Partner administration endpoints (admin portal). */
@RestController
@RequiredArgsConstructor
@RequestMapping("/partners")
@Validated
public class PartnerController {

    private final PartnerService partnerService;

    public record PartnerView(Long id, Long userId, String name, String email, String phone,
                              String city, String state, String country,
                              Double latitude, Double longitude,
                              boolean verified, boolean active) {}

    private static PartnerView view(Partner p) {
        return new PartnerView(p.getId(), p.getUserId(), p.getName(), p.getEmail(), p.getPhone(),
                p.getCity(), p.getState(), p.getCountry(), p.getLatitude(), p.getLongitude(),
                p.isVerified(), p.isActive());
    }

    @GetMapping
    public ResponseEntity<List<PartnerView>> list(@RequestParam(defaultValue = "false") boolean routableOnly) {
        List<Partner> result = routableOnly ? partnerService.findRoutable() : partnerService.findAll();
        return ResponseEntity.ok(result.stream().map(PartnerController::view).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartnerView> get(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(view(partnerService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<PartnerView> create(@RequestBody PartnerRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(view(partnerService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartnerView> update(@PathVariable @NotNull Long id, @RequestBody PartnerRequest req) {
        return ResponseEntity.ok(view(partnerService.update(id, req)));
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<PartnerView> verify(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(view(partnerService.setVerified(id, true)));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<PartnerView> activate(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(view(partnerService.setActive(id, true)));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<PartnerView> deactivate(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(view(partnerService.setActive(id, false)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable @NotNull Long id) {
        partnerService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(PartnerService.PartnerNotFoundException.class)
    public ResponseEntity<Map<String, String>> notFound(PartnerService.PartnerNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(PartnerService.DuplicatePartnerException.class)
    public ResponseEntity<Map<String, String>> duplicate(PartnerService.DuplicatePartnerException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
    }
}
