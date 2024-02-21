package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PersonNearbyDTO {
    private Long id;
    private String name;
    private String longitude;
    private String latitude;
    private List<String> requestsMaterialsPerson;
    private Role role;

}
