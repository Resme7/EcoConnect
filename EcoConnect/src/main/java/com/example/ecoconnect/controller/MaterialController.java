package com.example.ecoconnect.controller;

import com.example.ecoconnect.dto.MaterialDTO;
import com.example.ecoconnect.dto.convertor.DtoToEntity;
import com.example.ecoconnect.entities.Material;
import com.example.ecoconnect.service.MaterialService;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(value = "/api/materials")
@RestController
public class MaterialController {
    @Autowired
    private MaterialService materialService;

    private Validator validator;

    public MaterialController() {
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }
    @PostMapping
    public ResponseEntity saveMaterial(@RequestBody @Valid MaterialDTO materialDTO, BindingResult bindingResult) {
        DtoToEntity convertor = new DtoToEntity();
        Material material = convertor.convertorMaterialDtoToMaterialEntity(materialDTO);
        Map<String, String> validations = checkValidations(materialDTO);
        checkMaterialUnicity(materialDTO, validations);

        if (!validations.isEmpty()) {
            return new ResponseEntity<>(validations, HttpStatus.BAD_REQUEST);
        }

        materialService.saveMaterial(material);

        validations.put("Results", "The material will be created with succes.");
        return new ResponseEntity<>(validations, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity getMaterialById(@PathVariable Long id){
        Material material = materialService.getMaterialById(id);
        if(material == null){
            return new ResponseEntity("Material not found.", HttpStatus.NOT_FOUND);
        }else{

            return new ResponseEntity(material, HttpStatus.OK);
        }
    }

    @GetMapping
    public List<MaterialDTO> getAllMaterials(){
        List<MaterialDTO> materialDTOList = new ArrayList<>();
        DtoToEntity convertor = new DtoToEntity();

        for(Material material : materialService.getAllMaterials()){
            MaterialDTO materialDTO = convertor.convertorMaterialEntityToMaterialDto(material);
            materialDTOList.add(materialDTO);
        }
        return materialDTOList;
    }

    private Map<String, String> checkValidations(MaterialDTO materialDTO) {
        Set<ConstraintViolation<MaterialDTO>> violations = validator.validate(materialDTO);

        Map<String, String> validations = new HashMap<>();
        for (ConstraintViolation<MaterialDTO> violation : violations) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            validations.put(propertyPath, message);
        }
        return validations;
    }

    private void checkMaterialUnicity(MaterialDTO materialDTO, Map<String, String> validations) {
        if (materialService.getMaterialByName(materialDTO.getMaterialName()) != null) {
            validations.put("material", "This material is already added");
        }
    }
}
