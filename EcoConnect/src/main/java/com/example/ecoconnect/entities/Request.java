package com.example.ecoconnect.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Setter
@Getter
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "request")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long id;

    @Column(name = "request_date_created")
    private Date dateRequestCreated;

    @Column(name = "request_date_accepted")
    private Date dateRequestAccepted;

    @Column(name = "quantity")
    private String quantity;

    @Column(name = "unit")
    private String unit;

    @Enumerated
    @Column(name = "request_status")
    private Status status;

    @ManyToOne
    @JoinColumn(name = "person_id")
    private Person person;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;
}
