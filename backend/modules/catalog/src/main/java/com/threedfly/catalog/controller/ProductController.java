package com.threedfly.catalog.controller;

import com.threedfly.catalog.dto.ProductRequest;
import com.threedfly.catalog.dto.ProductResponse;
import com.threedfly.catalog.entity.Product;
import com.threedfly.catalog.repository.ProductRepository;
import com.threedfly.catalog.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Catalog CRUD + model/image file endpoints. Ported from product-service
 * minus the Shopify endpoints (moved to integrations) and minus the
 * setup-shopify dev hack (replaced by the real OAuth flow).
 *
 * File storage debt: images/STL currently live as DB blobs (legacy design);
 * moving them to S3 presigned URLs is planned for the infra phase.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
@Validated
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable @NotNull Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.save(request));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> createProductWithFiles(
            @RequestPart("product") @Valid ProductRequest request,
            @RequestParam(value = "stlFile", required = false) MultipartFile stlFile,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        ProductResponse product = productService.save(request);
        storeFiles(product.getId(), stlFile, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.findById(product.getId()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable @NotNull Long id,
                                                         @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> updateProductWithFiles(
            @PathVariable @NotNull Long id,
            @RequestPart("product") @Valid ProductRequest request,
            @RequestParam(value = "stlFile", required = false) MultipartFile stlFile,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        productService.update(id, request);
        storeFiles(id, stlFile, imageFile);
        return ResponseEntity.ok(productService.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable @NotNull Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductService.ProductNotFoundException(id));
        if (product.getImageData() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(product.getImageContentType()))
                .header("Content-Disposition", "inline; filename=\"" + product.getImageFilename() + "\"")
                .body(product.getImageData());
    }

    @GetMapping("/{id}/stl")
    public ResponseEntity<byte[]> getProductStl(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductService.ProductNotFoundException(id));
        if (product.getStlData() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(product.getStlContentType() != null
                        ? product.getStlContentType() : "application/octet-stream"))
                .header("Content-Disposition", "attachment; filename=\"" + product.getStlFilename() + "\"")
                .body(product.getStlData());
    }

    private void storeFiles(Long productId, MultipartFile stlFile, MultipartFile imageFile) throws IOException {
        boolean hasStl = stlFile != null && !stlFile.isEmpty();
        boolean hasImage = imageFile != null && !imageFile.isEmpty();
        if (!hasStl && !hasImage) {
            return;
        }
        Product entity = productRepository.findById(productId)
                .orElseThrow(() -> new ProductService.ProductNotFoundException(productId));
        if (hasStl) {
            String name = stlFile.getOriginalFilename();
            if (name == null || !name.toLowerCase().endsWith(".stl")) {
                throw new IllegalArgumentException("File must be an STL file: " + name);
            }
            entity.setStlData(stlFile.getBytes());
            entity.setStlFilename(name);
            entity.setStlContentType(stlFile.getContentType());
        }
        if (hasImage) {
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("File must be an image: " + imageFile.getOriginalFilename());
            }
            entity.setImageData(imageFile.getBytes());
            entity.setImageFilename(imageFile.getOriginalFilename());
            entity.setImageContentType(contentType);
        }
        productRepository.save(entity);
    }
}
