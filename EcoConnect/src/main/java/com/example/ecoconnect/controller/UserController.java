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

    @GetMapping
    public ResponseEntity getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDetailMapDTO> userDetailMapDTOS = new ArrayList<>();

        setUserMapDetails(users, userDetailMapDTOS);

        return new ResponseEntity<>(userDetailMapDTOS, HttpStatus.OK);
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


    @GetMapping(value = "/nearby-users-for-person/{id}")
    public ResponseEntity getNearbyUsersForPerson(@PathVariable Long id) {
        Person person = personService.getByUserId(id);
        if (checkPersonExist(person)) return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        Double personLatitude = Double.parseDouble(person.getLatitude());
        Double personLongitude = Double.parseDouble(person.getLongitude());
        List<PersonNearbyDTO> personNearbyDTOS = setNearbyPerson(personLatitude, personLongitude);
        List<CompanyDetailPracticeDTO> companyDetailPracticeDTOS = setNearbyCompanies(personLatitude, personLongitude);

        List<Object> combinedList = new ArrayList<>();
        combinedList.addAll(companyDetailPracticeDTOS);
        combinedList.addAll(personNearbyDTOS);

        return new ResponseEntity<>(combinedList, HttpStatus.OK);
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

    @GetMapping(value = "/nearby-users-after-moving")
    public ResponseEntity getNearbyUsersForAfterMapMoving(@RequestParam Double latitude, @RequestParam Double longitude, @RequestParam Long id) {
        Map<String, String> message = new HashMap<>();
        message.put("error", "Invalid latitude and longitude.");
        if (checkLatitudeAndLongitude(latitude, longitude))
            return new ResponseEntity<>(message, HttpStatus.OK);
        List<CompanyDetailPracticeDTO> companyDetailPracticeDTOList = setNearbyCompanies(latitude, longitude);
        List<PersonNearbyDTO> personNearbyDTOS = setNearbyPerson(latitude, longitude);

        removeUserWithLocationLoggedIn(id, companyDetailPracticeDTOList, personNearbyDTOS);

        List<Object> combinedList = new ArrayList<>();
        combinedList.addAll(companyDetailPracticeDTOList);
        combinedList.addAll(personNearbyDTOS);

        return new ResponseEntity<>(combinedList, HttpStatus.OK);
    }

    @GetMapping(value = "/companies/practice-info")
    public ResponseEntity getAllCompaniesWithPracticeInfo() {
        List<CompanyDetailPracticeDTO> companyDetailPracticeDTOList = new ArrayList<>();
        DtoToEntity convertor = new DtoToEntity();
        setCompaniesPracticeInfos(companyDetailPracticeDTOList, convertor);
        return new ResponseEntity(companyDetailPracticeDTOList, HttpStatus.OK);
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

    private void setCompaniesPracticeInfos(List<CompanyDetailPracticeDTO> companyDetailsPracticeDtoList, DtoToEntity convertor) {
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
            companyDetailsPracticeDtoList.add(companyDetailPracticeDTO);
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
