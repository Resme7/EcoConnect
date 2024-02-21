package com.example.ecoconnect.controller;


import com.example.ecoconnect.dto.PersonDTO;
import com.example.ecoconnect.dto.convertor.DtoToEntity;
import com.example.ecoconnect.entities.Person;
import com.example.ecoconnect.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/people")
public class PersonController  {

    @Autowired
    private PersonService personService;

    @PostMapping
    public ResponseEntity savePerson(@RequestBody PersonDTO personDTO){
        DtoToEntity dtoToEntity = new DtoToEntity();
        Person person = dtoToEntity.convertorPersonDtoToEntity(personDTO);
        personService.savePerson(person);
        return new ResponseEntity<>("Person added", HttpStatus.OK);

    }

    @GetMapping(value = "/{id}")
    public ResponseEntity getPersonById(@PathVariable Long id){
        Person person = personService.getPersonById(id);
        return new ResponseEntity<>(person, HttpStatus.OK);
    }
}
