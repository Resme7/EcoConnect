package com.example.ecoconnect.controller;

import com.example.ecoconnect.dto.*;
import com.example.ecoconnect.dto.convertor.DtoToEntity;
import com.example.ecoconnect.entities.*;
import com.example.ecoconnect.service.*;
import com.example.ecoconnect.util.MessageContent;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.*;


@RestController
@RequestMapping(value = "/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    @Autowired
    private PersonService personService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserService userService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private RequestService requestService;

    @Autowired
    private DistanceBetweenUsers distanceBetweenUsers;

    private Validator validator;

    public UserController(){
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @PostMapping(value = "/login")
    public ResponseEntity login(@RequestBody(required = false) UserLoginDTO userLoginDTO) {

        if (checkLoginFields(userLoginDTO))
            return new ResponseEntity<>(MessageContent.LOGIN_ERROR, HttpStatus.BAD_REQUEST);

        User user = userService.getByEmail(userLoginDTO.getEmail());

        return checkUserExistence(userLoginDTO, user);
    }

    @GetMapping("/person-id/{userId}")
    public ResponseEntity<Map<String, Object>> getPersonIdByUserId(@PathVariable Long userId) {
        Person person = personService.getByUserId(userId);
        if (person == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("personId", person.getPersonId());
        response.put("latitude", person.getLatitude());
        response.put("longitude", person.getLongitude());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/company-id/{userId}")
    public ResponseEntity<Map<String, Object>> getCompanyIdByUserId(@PathVariable Long userId) {
        Company company = companyService.getByUserId(userId);
        if (company == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("companyId", company.getCompanyId());
        response.put("latitude", company.getLatitude());
        response.put("longitude", company.getLongitude());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping(value = "/{id}")
    public ResponseEntity getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);

        if (user == null) {
            Map<String, String> userNullMessage = new HashMap<>();
            userNullMessage.put("message", MessageContent.USER_NOT_FOUND);
            return new ResponseEntity<>(userNullMessage, HttpStatus.OK);
        }

        ResponseEntity userDetailDTO = returnUserDetailsByRole(user);

        if (userDetailDTO != null)
            return userDetailDTO;
        else
            return new ResponseEntity<>("Bad request.", HttpStatus.BAD_REQUEST);
    }
    @GetMapping(value = "/nearby-companies/{personId}/{radius}")
    public ResponseEntity<List<CompanyDetailPracticeDTO>> getNearbyCompanies(@PathVariable Long personId, @PathVariable Double radius) {
        Person person = personService.getByUserId(personId);
        if (person == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Double personLatitude = Double.parseDouble(person.getLatitude());
        Double personLongitude = Double.parseDouble(person.getLongitude());
        List<CompanyDetailPracticeDTO> nearbyCompanies = setNearbyCompaniesRadius(personLatitude, personLongitude, radius);
        return new ResponseEntity<>(nearbyCompanies, HttpStatus.OK);
    }

    @GetMapping(value = "/nearby-users-for-company/{id}")
    public ResponseEntity getNearbyUsersForCompany(@PathVariable Long id) {
        Company company = companyService.getByUserId(id);
        if (checkCompanyExist(company)) return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        Double companyLatitude = Double.parseDouble(company.getLatitude());
        Double companyLongitude = Double.parseDouble(company.getLongitude());
        List<PersonNearbyDTO> personNearbyDTOS = setNearbyPerson(companyLatitude, companyLongitude);
        List<CompanyDetailPracticeDTO> companyDetailPracticeDTOS = setNearbyCompanies(companyLatitude, companyLongitude);

        List<Object> combinedList = new ArrayList<>();
        combinedList.addAll(companyDetailPracticeDTOS);
        combinedList.addAll(personNearbyDTOS);

        return new ResponseEntity<>(combinedList, HttpStatus.OK);
    }



    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    private ResponseEntity checkUserExistence(UserLoginDTO userLoginDTO, User user) {
        if (user == null) {
            return new ResponseEntity<>(MessageContent.LOGIN_ERROR, HttpStatus.BAD_REQUEST);
        }
        if (validate(userLoginDTO, user.getEmail(), user.getPassword()))
        {
            ResponseEntity personDetailDTO = returnUserDetailsByRole(user);
            if (personDetailDTO != null)
                return personDetailDTO;
        }
        return new ResponseEntity<>(MessageContent.LOGIN_ERROR, HttpStatus.BAD_REQUEST);
    }
    private ResponseEntity returnUserDetailsByRole(User user) {
        DtoToEntity convertor = new DtoToEntity();
        if (user.getRole() == Role.Person) {
            Person person = personService.getByUserId(user.getUserId());
            PersonDetailDTO personDetailsDTO = convertor.convertorPersonDetailDtoToEntity(person, user);

            return new ResponseEntity<>(personDetailsDTO, HttpStatus.OK);
        } else if (user.getRole() == Role.Company) {
            Company company = companyService.getByUserId(user.getUserId());
            CompanyDetailDTO companyDetailsDto = convertor.convertorCompanyDetailDtoToEntity(company, user);

            return new ResponseEntity<>(companyDetailsDto, HttpStatus.OK);
        }
        return null;
    }

    private boolean checkLoginFields(UserLoginDTO userLoginDTO) {
        if (userLoginDTO == null) {
            return true;
        } else if (userLoginDTO.getEmail() == null || userLoginDTO.getEmail().isEmpty()) {
            return true;
        } else {
            return userLoginDTO.getPassword() == null || userLoginDTO.getPassword().isEmpty();
        }
    }


    private boolean validate(UserLoginDTO userLoginDTO, String email, String password) {
        String encryptPwd = CryptPassword.encrypt(userLoginDTO.getPassword(), MessageContent.SECRET_KEY);
        return userLoginDTO.getEmail().equals(email) && encryptPwd.equals(password);
    }

    private List<PersonNearbyDTO> setNearbyPerson(Double latitude, Double longitude) {
        List<Person> nearbyPerson = distanceBetweenUsers.getAllNearbyPersonWithStatusOnHold(latitude, longitude);
        List<PersonNearbyDTO> personNearbyDTOList = new ArrayList<>();
        DtoToEntity convertor = new DtoToEntity();

        for (Person person : nearbyPerson) {
            PersonNearbyDTO personNearbyDTO = convertor.convertorPersonEntityToPersonNearbyDTO(person);
            User user = userService.getByPersonId(person.getPersonId());

            List<String> materials = new ArrayList<>();

            for (Request request : requestService.getAllByPersonId(person.getPersonId())) {
                Material material = request.getMaterial();
                if (!materials.contains(material.getMaterialName())) {
                    materials.add(material.getMaterialName());
                }
            }

            personNearbyDTO.setRequestsMaterialsPerson(materials);
            personNearbyDTO.setId(user.getUserId());
            personNearbyDTOList.add(personNearbyDTO);
        }
        return personNearbyDTOList;
    }

    private List<CompanyDetailPracticeDTO> setNearbyCompanies(Double latitude, Double longitude) {
        List<Company> nearbyCompany = distanceBetweenUsers.getAllNearbyCompany(latitude, longitude);
        List<CompanyDetailPracticeDTO> companyDetailPracticeDTOS = new ArrayList<>();
        DtoToEntity convertor = new DtoToEntity();

        for (Company company : nearbyCompany) {
            List<String> materials = new ArrayList<>();
            for (Material material : company.getMaterialList()) {

                if (materialService.getMaterialByName(material.getMaterialName()) != null && !materials.contains(material.getMaterialName())) {
                    materials.add(material.getMaterialName());
                }
            }
            CompanyDetailPracticeDTO companyDetailPracticeDTO = convertor.convertorCompanyEntityToCompanyDetailPracticeDTO(company, materials);
            User user = userService.getByCompanyId(company.getCompanyId());
            companyDetailPracticeDTO.setId(user.getUserId());
            companyDetailPracticeDTOS.add(companyDetailPracticeDTO);
        }
        return companyDetailPracticeDTOS;
    }
    private List<CompanyDetailPracticeDTO> setNearbyCompaniesRadius(Double latitude, Double longitude, Double radius) {
        List<Company> nearbyCompany = distanceBetweenUsers.getAllNearbyCompanyRadius(latitude, longitude, radius);
        List<CompanyDetailPracticeDTO> companyDetailPracticeDTOS = new ArrayList<>();
        DtoToEntity convertor = new DtoToEntity();

        for (Company company : nearbyCompany) {
            List<String> materials = new ArrayList<>();
            for (Material material : company.getMaterialList()) {

                if (materialService.getMaterialByName(material.getMaterialName()) != null && !materials.contains(material.getMaterialName())) {
                    materials.add(material.getMaterialName());
                }
            }
            CompanyDetailPracticeDTO companyDetailPracticeDTO = convertor.convertorCompanyEntityToCompanyDetailPracticeDTO(company, materials);
            User user = userService.getByCompanyId(company.getCompanyId());
            companyDetailPracticeDTO.setId(user.getUserId());
            companyDetailPracticeDTOS.add(companyDetailPracticeDTO);
        }
        return companyDetailPracticeDTOS;
    }

    private boolean checkCompanyExist(Company company) {
        if (company == null) {
            return true;
        }
        return false;
    }


}
