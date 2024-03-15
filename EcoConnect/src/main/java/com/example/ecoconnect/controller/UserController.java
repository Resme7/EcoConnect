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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin
@RequestMapping(value = "/api/users")
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
    @PostMapping
    public ResponseEntity saveUser(@RequestBody @Valid UserDTO userDto, BindingResult bindingResult) {
        DtoToEntity convertor = new DtoToEntity();
        User user = convertor.convertorUserDtoToUserEntity(userDto);

        Map<String, String> validations = checkValidations(userDto);

        if (!validations.isEmpty()) {
            return new ResponseEntity<>(validations, HttpStatus.BAD_REQUEST);
        }

        userService.saveUser(user);

        validations.put("Results", "The user will be created with succes.");
        return new ResponseEntity<>(validations, HttpStatus.OK);
    }

    private void setUserMapDetails(List<User> users, List<UserDetailMapDTO> userDetailMapDTOS) {
        for (User user : users) {
            UserDetailMapDTO userDetailMapDTO = new UserDetailMapDTO();
            userDetailMapDTO.setUserId(user.getUserId());
            userDetailMapDTO.setRole(user.getRole());
            if (user.getRole() == Role.Person) {
                Person person = personService.getByUserId(user.getUserId());
                userDetailMapDTO.setLatitude(person.getLatitude());
                userDetailMapDTO.setLongitude(person.getLongitude());
            } else if (user.getRole() == Role.Company) {
                Company company = companyService.getByUserId(user.getUserId());
                userDetailMapDTO.setLatitude(company.getLatitude());
                userDetailMapDTO.setLongitude(company.getLongitude());
            }
            userDetailMapDTOS.add(userDetailMapDTO);
        }
    }

    private ResponseEntity checkUserExistence(UserLoginDTO userLoginDTO, User user) {
        if (user == null) {
            return new ResponseEntity<>(MessageContent.LOGIN_ERROR, HttpStatus.BAD_REQUEST);
        }
        if (user!=null) //validate(userLoginDTO, user.getEmail(), user.getPassword()))
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
            PersonDetailDTO citizenDetailsDto = convertor.convertorPersonDetailDtoToEntity(person, user);

            return new ResponseEntity<>(citizenDetailsDto, HttpStatus.OK);
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
    private Map<String, String> checkValidations(UserDTO userDTO) {
        Set<ConstraintViolation<UserDTO>> violations = validator.validate(userDTO);

        Map<String, String> validations = new HashMap<>();
        for (ConstraintViolation<UserDTO> violation : violations) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            validations.put(propertyPath, message);
        }
        return validations;
    }

//    private boolean validate(UserLoginDTO userLoginTO, String email, String password) {
//        String encryptPwd = EncryptDecrypt.encrypt(userLoginDTO.getPassword(), MessageContent.SECRET_KEY);
//        return userLoginDTO.getEmail().equals(email) && encryptPwd.equals(password);
//    }

    private List<PersonNearbyDTO> setNearbyCitizens(Double latitude, Double longitude) {
        List<Person> nearbyPerson = distanceBetweenUsers.getAllNearbyPersonWithStatusOnHold(latitude, longitude);
        List<PersonNearbyDTO> personnNearbyDTOList = new ArrayList<>();
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
            personnNearbyDTOList.add(personNearbyDTO);
        }
        return personnNearbyDTOList;
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

    private void setCompaniesPracticeInfos(List<CompanyDetailPracticeDTO> companyDetailsHoverDtoList, DtoToEntity convertor) {
        for (Company company : companyService.getAllCompanies()) {

            List<String> materials = new ArrayList<>();
            for (Material material : company.getMaterialList()) {
                if (materialService.getMaterialByName(material.getMaterialName()) != null && !materials.contains(material.getMaterialName())) {
                    materials.add(material.getMaterialName());
                }
            }
            CompanyDetailPracticeDTO companyDetailPracticeDTO = convertor.convertorCompanyEntityToCompanyDetailPracticeDTO(company, materials);
            User user = userService.getByCompanyId(company.getCompanyId());
            companyDetailPracticeDTO.setId(user.getUserId());
            companyDetailsHoverDtoList.add(companyDetailPracticeDTO);
        }
    }

    private boolean checkLatitudeAndLongitude(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return true;
        }
        return false;
    }

    private boolean checkPersonExist(Person person) {
        if (person == null) {
            return true;
        }
        return false;
    }

    private boolean checkCompanyExist(Company company) {
        if (company == null) {
            return true;
        }
        return false;
    }

    private void removeUserWithLocationLoggedIn(@RequestParam Long id, List<CompanyDetailPracticeDTO> companyDetailPracticeDTOList, List<PersonNearbyDTO> personNearbyDTOS) {
        Iterator companiesIterator = companyDetailPracticeDTOList.iterator();
        CompanyDetailPracticeDTO companyDetailPracticeDTO;
        while (companiesIterator.hasNext()) {
            companyDetailPracticeDTO = (CompanyDetailPracticeDTO) companiesIterator.next();
            if (companyDetailPracticeDTO.getId().equals(id)) {
                companiesIterator.remove();
            }
        }

        Iterator personIterator = personNearbyDTOS.iterator();
        PersonNearbyDTO PersonNearbyDto;
        while (personIterator.hasNext()) {
            PersonNearbyDto = (PersonNearbyDTO) personIterator.next();
            if (PersonNearbyDto.getId().equals(id)) {
                personIterator.remove();
            }
        }
    }
}
