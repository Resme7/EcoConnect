package com.example.ecoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MaterialDTO {
    @NotNull(message = "This field cannot be empty!")
    @Size(min = 1, max = 20, message = "Material name provided does not adhere to the specified field validation rules")
    @Pattern(message = "Material name provided does not adhere to the specified field validation rules", regexp = "[a-zA-Z- ]*$")
    private String materialName;
}
