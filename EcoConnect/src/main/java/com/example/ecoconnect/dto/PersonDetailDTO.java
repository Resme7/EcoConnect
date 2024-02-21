package com.example.ecoconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PersonDetailDTO {
    private Long id;
    private String firstName;
    private String LastName;
    private String email;
    private String personAddress;
    private String numberPhone;
    private String latitude;
    private String longitude;

}
