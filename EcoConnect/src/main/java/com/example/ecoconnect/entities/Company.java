package com.example.ecoconnect.entities;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "companyId")
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_description", nullable = false)
    private String description;

    @Column(name = "company_address", nullable = false)
    private String companyAddress;

    @Column(name = "company_number_phone", unique = true, nullable = false)
    private String companyNumberPhone;

    @Column(name = "company_code", unique = true, nullable = false)
    private String companyCode;

    @Column(name = "company_latitude", nullable = false)
    private String latitude;

    @Column(name = "company_longitude", nullable = false)
    private String longitude;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "material_company",
            joinColumns = @JoinColumn(name = "company_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    private List<Material> materialList = new ArrayList<>();

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    private List<Request> requestList;

    @OneToOne
    private User user;
    @PostLoad
    public void logMaterials() {
        System.out.println("Material List for Company ID " + companyId + ":");
        for (Material material : materialList) {
            System.out.println("Material ID: " + material.getMaterialId() + ", Material Name: " + material.getMaterialName());
        }
    }

    public void setName(String companyName){
        this.companyName=companyName;
    }
    public String getName(){
        return this.companyName;
    }
}
