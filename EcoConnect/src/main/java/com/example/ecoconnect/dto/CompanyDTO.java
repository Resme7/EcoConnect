package com.example.ecoconnect.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Setter
@Getter
public class CompanyDTO {
    @NotNull(message = "Required")
    @Size(max = 50, message = "Company Name provided does not adhere to the specified field validation rules")
    private String companyName;

    @NotNull(message = "Required")
    @Size(max = 200, message = "descriptionCompany provided does not adhere to the specified field validation rules")
    private String descriptionCompany;

    @NotNull(message = "Required")
    @Size(max = 50, message = "Email provided does not adhere to the specified field validation rules")
    @Pattern(regexp = "([a-zA-Z0-9]+)[@]([a-z]+)[.]([a-z]+)", message = "Email provided does not adhere to the specified field validation rules")
    private String email;

    @NotNull(message = "Required")
    @Size(min = 8, max = 50, message = "Password provided does not adhere to the specified field validation rules")
    private  String password;

    @NotNull(message = "Required")
    @Size(max = 30, message = "Street provided does not adhere to the specified field validation rules")
    @Pattern(message = "Street provided does not adhere to the specified field validation rules", regexp = "[a-zA-Z ]*$")
    private String street;

    @NotNull(message = "Required")
    @Size(max = 10, message = "Number provided does not adhere to the specified field validation rules")
    @Pattern(message = "Number provided does not adhere to the specified field validation rules", regexp = "[0-9]*$")
    private String number;

    @NotNull(message = "Required")
    @Size(max = 10, message = "Building provided does not adhere to the specified field validation rules")
    @Pattern(message = "Building provided does not adhere to the specified field validation rules", regexp = "[a-zA-Z0-9-]*$")
    private String building;

    @NotNull(message = "Required")
    @Size(max = 10, message = "Entrance provided does not adhere to the specified field validation rules")
    @Pattern(message = "Entrance provided does not adhere to the specified field validation rules", regexp = "[a-zA-Z0-9-]*$")
    private String entrance;

    @NotNull(message = "Required")
    @Size(max = 10, message = "Apartment number provided does not adhere to the specified field validation rules")
    @Pattern(message = "Apartment number provided does not adhere to the specified field validation rules", regexp = "[0-9-]*$")
    private String apartNumber;

    @NotNull(message = "Required")
    @Size(min = 10, max = 10, message = "Phone number provided does not adhere to the specified field validation rules")
    @Pattern(message = "Phone number provided does not adhere to the specified field validation rules", regexp = "[0][7]([0-9]{8})*$")
    private String companyNumberPhone;

    @NotNull(message = "Required")
    @Size(min = 4, max = 12, message = "Company code provided does not adhere to the specified field validation rules")
    @Pattern(message = "Company code provided does not adhere to the specified field validation rules", regexp = "[R][O]([0-9]+)*$")
    private String companyCode;

    @NotNull(message = "Required")
    @Size(min = 1, max = 15, message = "Types of waste provided does not adhere to the specified field validation rules")
    private List<
                @Pattern(message = "Material name provided does not adhere to the specified field validation rules", regexp = "[a-zA-Z- ]*$")
                @Size(min = 1, max = 20, message = "Material name provided does not adhere to the specified field validation rules")
                        String> materialName;

    private String latitude;
    private String longitude;



}
