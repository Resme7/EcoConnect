package com.example.ecoconnect.service.implement;

import com.example.ecoconnect.entities.Material;
import com.example.ecoconnect.repository.MaterialRepository;
import com.example.ecoconnect.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialServiceImplement implements MaterialService {
    @Autowired
    MaterialRepository materialRepository;

    @Override
    public List<Material> getAllMaterials(){
        return materialRepository.findAll();
    }

    @Override
    public Material getMaterialById(Long materialId) {
        return materialRepository.findByMaterialId(materialId);
    }

    @Override
    public Material getMaterialByName(String materialName) {
        return materialRepository.findByMaterialName(materialName);
    }

    @Override
    public Material saveMaterial(Material material) {
        return materialRepository.saveAndFlush(material);
    }

    @Override
    public List<Material> saveAllMaterial(List<Material> materialList) {
        return materialRepository.saveAll(materialList);
    }

}
