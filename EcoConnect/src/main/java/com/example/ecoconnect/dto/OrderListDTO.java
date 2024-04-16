package com.example.ecoconnect.dto;

import lombok.*;

import java.util.Date;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderListDTO {
    private Long id;
    private Date dateCreated;
    private Date dateCollection;
    private String materialName;
    private String quantity;
    private String address;
    private String phoneNumber;
    private String personName;
    private String unit;
}
