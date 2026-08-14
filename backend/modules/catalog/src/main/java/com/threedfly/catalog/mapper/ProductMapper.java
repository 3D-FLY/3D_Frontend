package com.threedfly.catalog.mapper;

import com.threedfly.catalog.dto.ProductRequest;
import com.threedfly.catalog.dto.ProductResponse;
import com.threedfly.catalog.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    private final ModelMapper modelMapper;

    // Public base URL of this deployment — used to build media links that
    // external systems (e.g. Shopify) must be able to fetch.
    @Value("${app.public-base-url:http://localhost:8080}")
    private String publicBaseUrl;

    @Autowired
    public ProductMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponse response = modelMapper.map(product, ProductResponse.class);
        
        // Map file metadata and generate URLs
        mapFileData(product, response);
        
        // Custom logic for shop name since it requires navigation to shop entity
        response.setShopName(product.getShop() != null ? product.getShop().getName() : null);
        
        return response;
    }
    
    private void mapFileData(Product product, ProductResponse response) {
        // Handle image data
        response.setHasImage(product.getImageData() != null && product.getImageData().length > 0);
        response.setImageFilename(product.getImageFilename());
        response.setImageContentType(product.getImageContentType());
        
        // Handle STL data
        response.setHasStlFile(product.getStlData() != null && product.getStlData().length > 0);
        response.setStlFilename(product.getStlFilename());
        response.setStlContentType(product.getStlContentType());
        
        // Generate URLs for stored files if they exist
        if (response.isHasImage()) {
            response.setImageUrl(publicBaseUrl + "/products/" + product.getId() + "/image");
        }

        if (response.isHasStlFile()) {
            response.setStlFileUrl(publicBaseUrl + "/products/" + product.getId() + "/stl");
        }
    }

    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }

        return modelMapper.map(request, Product.class);
    }

    public void updateEntityFromRequest(Product product, ProductRequest request) {
        if (product == null || request == null) {
            return;
        }

        modelMapper.map(request, product);
    }
}