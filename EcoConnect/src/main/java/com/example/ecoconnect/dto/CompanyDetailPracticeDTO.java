package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
public class CompanyDetailPracticeDTO {
    private Long id;
    private String companyName;
    private String companyNumberPhone;
    private String email;
    private String address;
    private List<String> materialList;
    private String latitude;
    private String longitude;
    private Role role;

}
