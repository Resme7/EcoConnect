package com.example.ecoconnect.service.implement;

import com.example.ecoconnect.entities.Person;
import com.example.ecoconnect.repository.PersonRepository;
import com.example.ecoconnect.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonServiceImplement implements PersonService {

    @Autowired
    PersonRepository personRepository;

    @Override
    public Person getPersonById(Long idPerson){
        return personRepository.findByPersonId(idPerson);
    }

    @Override
    public Person getPersonByPhoneNumberPerson(String phoneNumberPerson){
        return personRepository.findByPhoneNumberPerson(phoneNumberPerson);
    }
    @Override
    public Person savePerson(Person person){
        return personRepository.save(person);
    }
}
