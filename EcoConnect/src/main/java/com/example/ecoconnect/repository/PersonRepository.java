package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Person;
import com.example.ecoconnect.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Person findByPersonId(Long personId);
    Person findByPhoneNumberPerson(String phoneNumberPerson);

    Person findByUserUserId(Long userId);
    @Query("select  p from Person p join p.requestList r where r.status = :status")
    List<Person> findAllPersonByRequestStatus(Status status);
}
