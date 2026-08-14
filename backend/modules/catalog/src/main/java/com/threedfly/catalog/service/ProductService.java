package com.threedfly.catalog.service;

import com.threedfly.catalog.dto.ProductRequest;
import com.threedfly.catalog.dto.ProductResponse;
import com.threedfly.catalog.entity.Product;
import com.threedfly.catalog.mapper.ProductMapper;
import com.threedfly.catalog.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Catalog CRUD only. Marketplace publishing lives in the integrations module
 * (PublishService) — the dependency arrow points integrations → catalog,
 * never back.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public List<ProductResponse> findAll() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return productMapper.toResponse(product);
    }

    public ProductResponse save(ProductRequest request) {
        log.info("Saving product '{}'", request.getName());
        Product product = productMapper.toEntity(request);
        return productMapper.toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        productMapper.updateEntityFromRequest(existing, request);
        return productMapper.toResponse(productRepository.save(existing));
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        productRepository.delete(product);
        log.info("Deleted product {}", id);
    }

    public static class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException(Long id) {
            super("Product not found with ID: " + id);
        }
    }
}
