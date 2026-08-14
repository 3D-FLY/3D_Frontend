package com.threedfly.catalog.service;

import com.threedfly.catalog.dto.ProductRequest;
import com.threedfly.catalog.dto.ProductResponse;
import com.threedfly.catalog.entity.Product;
import com.threedfly.catalog.mapper.ProductMapper;
import com.threedfly.catalog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private ProductMapper productMapper;

    private ProductService service;

    private Product product;
    private ProductResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new ProductService(productRepository, productMapper);

        product = new Product();
        product.setId(1L);
        product.setName("Benchy");
        product.setPrice(19.90);

        response = new ProductResponse();
        response.setId(1L);
        response.setName("Benchy");
    }

    @Test
    @DisplayName("findAll maps every product to a response")
    void findAll() {
        when(productRepository.findAll()).thenReturn(List.of(product));
        when(productMapper.toResponse(product)).thenReturn(response);

        List<ProductResponse> result = service.findAll();

        assertEquals(1, result.size());
        assertEquals("Benchy", result.get(0).getName());
    }

    @Test
    @DisplayName("findById returns mapped product when present")
    void findByIdFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toResponse(product)).thenReturn(response);

        assertEquals(1L, service.findById(1L).getId());
    }

    @Test
    @DisplayName("findById throws ProductNotFoundException when absent")
    void findByIdNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ProductService.ProductNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    @DisplayName("save maps request to entity, persists, maps back")
    void save() {
        ProductRequest request = new ProductRequest();
        request.setName("Benchy");
        when(productMapper.toEntity(request)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toResponse(product)).thenReturn(response);

        assertEquals("Benchy", service.save(request).getName());
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("update applies request onto existing entity and persists")
    void update() {
        ProductRequest request = new ProductRequest();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toResponse(product)).thenReturn(response);

        service.update(1L, request);

        verify(productMapper).updateEntityFromRequest(product, request);
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("update throws when product absent")
    void updateNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ProductService.ProductNotFoundException.class,
                () -> service.update(99L, new ProductRequest()));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("delete removes existing product")
    void delete() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        service.delete(1L);
        verify(productRepository).delete(product);
    }

    @Test
    @DisplayName("delete throws when product absent")
    void deleteNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ProductService.ProductNotFoundException.class, () -> service.delete(99L));
        verify(productRepository, never()).delete(any());
    }
}
