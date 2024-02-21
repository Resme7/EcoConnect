package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Role;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class UserDetailMapDTO {
    private Long userId;
    private String latitude;
    private String longitude;
    private Role role;
}
