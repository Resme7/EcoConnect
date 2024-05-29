package com.example.ecoconnect.entities;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "materialId")
@Table(name = "material")
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "material_id")
    private Long materialId;

    @Column(name = "material_name", nullable = false, unique = true)
    private String materialName;

    @OneToMany(mappedBy = "material", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Request> requests;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "materialList")
    private List<Company> companyList = new ArrayList<>();
}
