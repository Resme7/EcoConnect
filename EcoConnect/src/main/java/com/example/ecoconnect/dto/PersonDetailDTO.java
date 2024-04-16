package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Role;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonDetailDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String personAddress;
    private String numberPhone;
    private String latitude;
    private String longitude;
    private Role role;

}
