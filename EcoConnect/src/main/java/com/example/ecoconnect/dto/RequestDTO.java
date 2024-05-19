package com.example.ecoconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RequestDTO {
    @NotBlank(message = "Required")
    private String materialName;


    @NotBlank(message = "Required")
    @Pattern(message = "Only numbers between 0,1 and 500.", regexp = "^(([1-4][0-9][0-9],[0-9]*)|([1-4][0-9][0-9])|(100(\\.[0]{1,2})?|[1-9][0-9](\\,[0-9]*)?)|([0],[1-9][0-9]*)|10|([1][0],[0-9]*)|500|([1],[0-9]*)|1|[1-9]|([1-9],[0-9]*))$")
    private String quantity;

    @NotBlank(message = "Required")
    private String unit;
}
