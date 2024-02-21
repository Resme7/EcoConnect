package com.example.ecoconnect.entities;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "personId")
@Table(name = "person")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Long personId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "person_address", nullable = false)
    private String personAddress;

    @Column(name = "person_latitude", nullable = false)
    private String latitude;

    @Column(name = "person_longitude", nullable = false)
    private String longitude;

    @Column(name = "person_number_phone", nullable = false)
    private String phoneNumberPerson;

    @OneToOne
    private User user;

}
