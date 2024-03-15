package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    Material findByMaterialId(Long materialId);

    Material findByMaterialName(String materialName);
}