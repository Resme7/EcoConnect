package com.example.ecoconnect.controller;


import com.example.ecoconnect.dto.PersonDTO;
import com.example.ecoconnect.dto.convertor.DtoToEntity;
import com.example.ecoconnect.entities.Person;
import com.example.ecoconnect.entities.Role;
import com.example.ecoconnect.entities.User;
import com.example.ecoconnect.service.PersonService;
import com.example.ecoconnect.service.UserService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/api/people")
public class PersonController  {

    @Autowired
    private PersonService personService;

    @Autowired
    private UserService userService;

    private Validator validator;

    public PersonController() {
        ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @PostMapping
    public ResponseEntity savePerson(@RequestBody PersonDTO personDTO){
        User user = new User();
        DtoToEntity dtoToEntity = new DtoToEntity();
        Person person = dtoToEntity.convertorPersonDtoToEntity(personDTO);

        Map<String, String> validations = checkValidations(personDTO);

        checkPhoneNumberUnicity(personDTO, validations);
        checkEmailUnicity(personDTO, validations);

        if (!validations.isEmpty()) {
            return new ResponseEntity<>(validations, HttpStatus.BAD_REQUEST);
        }
        setUserDetails(personDTO, user);
        person.setUser(user);

        User userFromDatabase = userService.saveUser(user);
        personService.savePerson(person);

        validations.put("user_id", userFromDatabase.getUserId().toString());
        return new ResponseEntity<>(validations, HttpStatus.OK);


    }

    @GetMapping(value = "/{id}")
    public ResponseEntity getPersonById(@PathVariable Long id){
        Person person = personService.getPersonById(id);
        if (person == null) {
            Map<String, String> personNullMessage = new HashMap<>();
            personNullMessage.put("message", "Person not found");
            return new ResponseEntity<>(personNullMessage, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(person, HttpStatus.OK);
        }
    }

    private Map<String, String> checkValidations(PersonDTO personDTO) {
        Set<ConstraintViolation<PersonDTO>> violations = validator.validate(personDTO);

        Map<String, String> validations = new HashMap<>();
        for (ConstraintViolation<PersonDTO> violation : violations) {
            String propertyPath = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            validations.put(propertyPath, message);
        }
        return validations;
    }

    private void setUserDetails(PersonDTO personDTO, User user) {
        user.setEmail(personDTO.getEmail());
        user.setPassword(personDTO.getPassword());
        user.setRole(Role.Person);
    }

    private void checkEmailUnicity(PersonDTO personDTO, Map<String, String> validations) {
        if (userService.getByEmail(personDTO.getEmail()) != null) {
            validations.put("email", "This email is already used");
        }
    }

    private void checkPhoneNumberUnicity(PersonDTO personDTO, Map<String, String> validations) {
        if (personService.getPersonByPhoneNumberPerson(personDTO.getNumberPhone()) != null) {
            validations.put("personPhoneNumber", "This phone number is already used");
        }
    }
}
