package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Person findByPersonId(Long personId);
    Person findByPhoneNumberPerson(String phoneNumberPerson);

}
