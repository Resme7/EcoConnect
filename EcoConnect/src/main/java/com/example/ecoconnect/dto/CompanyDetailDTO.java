package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Role;
import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyDetailDTO {
    private Long id;
    private String companyName;
    private String email;
    private String description;
    private String companyCode;
    private String companyNumberPhone;
    private String companyAddress;
    private String latitude;
    private String longitude;
    private Role role;
}
