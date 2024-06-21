package com.example.ecoconnect.controller;

import com.example.ecoconnect.dto.CollectionStationDTO;
import com.example.ecoconnect.dto.CompanyDTO;
import com.example.ecoconnect.dto.OrderListDTO;
import com.example.ecoconnect.dto.convertor.DtoToEntity;
import com.example.ecoconnect.entities.*;
import com.example.ecoconnect.service.CompanyService;
import com.example.ecoconnect.service.MaterialService;
import com.example.ecoconnect.service.RequestService;
import com.example.ecoconnect.service.UserService;
import com.example.ecoconnect.util.MessageContent;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping(value = "/api/companies")
public class CompanyController {


        @Autowired
        private CompanyService companyService;

        @Autowired
        private MaterialService materialService;

        @Autowired
        private RequestService requestService;

        @Autowired
        private UserService userService;

        private Validator validator;

        public CompanyController() {
            ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
            validator = validatorFactory.getValidator();
        }

        @PostMapping
        public ResponseEntity saveCompany(@RequestBody @Valid CompanyDTO companyDTO, BindingResult bindingResult){
                User user= new User();
                DtoToEntity convertor = new DtoToEntity();
                Company company = convertor.convertorCompanyDtoToEntity(companyDTO);
                List<Material> materials = new ArrayList<>();

                Map<String, String> validations = checkValidations(companyDTO);
                checkCompanyCodeUnicity(companyDTO, validations);
                checkPhoneNumberUnicity(companyDTO, validations);
                checkEmailUnicity(companyDTO, validations);

                if (!validations.isEmpty()) {
                        return new ResponseEntity<>(validations, HttpStatus.BAD_REQUEST);
                }
                processMaterialList(companyDTO, materials);
                materialService.saveAllMaterial(materials);
                company.setMaterialList(materials);

                setUserDetails(companyDTO, user);
                company.setUser(user);
                User userFromDatabase =userService.saveUser(user);
                companyService.saveCompany(company);

                validations.put("user_id", userFromDatabase.getUserId().toString());
                return new ResponseEntity<>(validations, HttpStatus.OK);

        }
        @GetMapping(value = "/{id}")
        public ResponseEntity getCompanyById(@PathVariable Long id) {
                Company company = companyService.getCompanyById(id);
                Map<String, String> companyNullMessage = new HashMap<>();
                companyNullMessage.put("message", MessageContent.USER_NOT_FOUND);
                if (company == null) {
                        return new ResponseEntity<>(companyNullMessage, HttpStatus.NOT_FOUND);
                } else {
                        return new ResponseEntity<>(company, HttpStatus.OK);
                }
        }
        @GetMapping("/material/{materialName}")
        public ResponseEntity<List<Long>> getCompaniesByMaterialName(@PathVariable String materialName) {
                 List<Long> companies = companyService.getCompanyByMaterialName(materialName);
                if (companies.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                } else {
                        return ResponseEntity.ok(companies);
                }
        }

        @GetMapping(value = "/{id}/accepted-request")
        public ResponseEntity getAllRequestAccepted(@PathVariable Long id) {
                Company company = companyService.getByUserId(id);
                if (company == null)
                        return new ResponseEntity("Company not found.", HttpStatus.NOT_FOUND);
                if(requestService.getAllByPersonUserIdAndStatus(id, Status.PROCESSING)==null || requestService.getAllByCompanyUserIdAndStatus(id,Status.PROCESSING).size()==0){
                        return new ResponseEntity(Collections.emptyList(), HttpStatus.OK);
                }
                else{
                        List<OrderListDTO> orderList = new ArrayList<>();
                        for(Request request : requestService.getAllByCompanyUserIdAndStatus(id, Status.PROCESSING)){
                                DtoToEntity convertor = new DtoToEntity();
                                OrderListDTO orderListDTO = convertor.convertorRequestEntityToOrderListDTO(request);
                                orderList.add(orderListDTO);
                        }
                        return new ResponseEntity<>(orderList, HttpStatus.OK);
                }
        }

        @GetMapping
        public ResponseEntity getAllCompanies() {
                List<CollectionStationDTO> collectionStationDTOList = new ArrayList<>();
                DtoToEntity convertor = new DtoToEntity();
                for (Company company : companyService.getAllCompanies()) {
                        CollectionStationDTO collectionStationDTO = convertor.convertorCompanyEntityToCollectionStationDto(company);
                        collectionStationDTOList.add(collectionStationDTO);
                }

                return new ResponseEntity(collectionStationDTOList, HttpStatus.OK);
        }
        private void setUserDetails(CompanyDTO companyDTO, User user) {
                user.setEmail(companyDTO.getEmail());
                user.setPassword(companyDTO.getPassword());
                user.setRole(Role.Company);
        }


        private void processMaterialList(CompanyDTO companyDTO, List<Material> materials){
                for(String name : companyDTO.getMaterialName()){
                        Material material = materialService.getMaterialByName(name);
                        if(material != null){
                                materials.add(material);
                        } else
                        {
                                Material materialNew = new Material();
                                materialNew.setMaterialName(name);
                                materials.add(materialNew);
                        }
                }
        }

        private Map<String, String> checkValidations(CompanyDTO companyDTO) {
                Set<ConstraintViolation<CompanyDTO>> violations = validator.validate(companyDTO);

                Map<String, String> validations = new HashMap<>();
                for (ConstraintViolation<CompanyDTO> violation : violations) {
                        String propertyPath = violation.getPropertyPath().toString();
                        String message = violation.getMessage();
                        if (propertyPath.startsWith("materialName[")) {
                                propertyPath = "materialName";
                        }
                        validations.put(propertyPath, message);
                }
                return validations;
        }

        private void checkEmailUnicity(CompanyDTO companyDTO, Map<String, String> validations) {
                if (userService.getByEmail(companyDTO.getEmail()) != null) {
                        validations.put("email", "This email is already used");
                }
        }

        private void checkPhoneNumberUnicity(CompanyDTO companyDTO, Map<String, String> validations) {
                if (companyService.getCompanyByNumberPhone(companyDTO.getCompanyNumberPhone()) != null) {
                        validations.put("companyPhoneNumber", "This phone number is already used");
                }
        }

        private void checkCompanyCodeUnicity(CompanyDTO companyDTO, Map<String, String> validations) {
                if (companyService.getCompanyByCompanyCode(companyDTO.getCompanyCode()) != null) {
                        validations.put("uniqueCode", "This UIC number is already used");
                }
        }

}
