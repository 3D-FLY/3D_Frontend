package com.threedfly.partners.repository;

import com.threedfly.partners.entity.FilamentStock;
import com.threedfly.partners.entity.FilamentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FilamentStockRepository extends JpaRepository<FilamentStock, Long> {

    List<FilamentStock> findByPartnerId(Long partnerId);

    List<FilamentStock> findByPartnerIdAndMaterialTypeAndAvailableTrue(Long partnerId, FilamentType materialType);
}
