package com.example.ecoconnect.dto;


import com.example.ecoconnect.entities.Role;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    @NotNull(message = "Required")
    @Size(max = 50, message = "Email provided does not adhere to the specified field validation rules")
    @Pattern(regexp = "([a-zA-Z0-9]+)[@]([a-z]+)[.]([a-z]+)", message = "Email provided does not adhere to the specified field validation rules")
    private String email;

    @NotNull(message = "Required")
    @Size(min = 8, max = 50, message = "Password provided does not adhere to the specified field validation rules")
    private String password;
    private Role role;
}
