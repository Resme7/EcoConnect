package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PersonDetailDTO {
    private Long id;
    private String firstName;
    private String LastName;
    private String email;
    private String personAddress;
    private String numberPhone;
    private String latitude;
    private String longitude;
    private Role role;

}
