package com.example.ecoconnect.service;

import com.example.ecoconnect.entities.Person;
import org.springframework.stereotype.Service;

@Service
public interface PersonService {
    Person getPersonById(Long idPerson);
    Person getPersonByPhoneNumberPerson(String phoneNumberPerson);
    Person savePerson(Person person);

    Person getByUserId(Long userId);

}
