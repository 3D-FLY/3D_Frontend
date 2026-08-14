package com.threedfly.integrations.controller;

import com.threedfly.integrations.entity.ProductSync;
import com.threedfly.integrations.entity.ShopType;
import com.threedfly.integrations.provider.PublishToStoreRequest;
import com.threedfly.integrations.service.PublishService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Marketplace publish endpoints (moved out of the legacy ProductController).
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/publish")
public class PublishController {

    private final PublishService publishService;

    @PostMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> publish(@PathVariable @NotNull Long id,
                                                       @RequestBody PublishToStoreRequest req) throws Exception {
        ProductSync sync = publishService.publish(id, req);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "productId", id,
                "externalProductId", sync.getExternalProductId(),
                "syncState", sync.getSyncState()
        ));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> deleteFromStore(@PathVariable @NotNull Long id,
                                                               @RequestParam @NotNull ShopType shopType) throws Exception {
        publishService.deleteFromStore(id, shopType);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "productId", id,
                "message", "Product deleted from " + shopType
        ));
    }
}
