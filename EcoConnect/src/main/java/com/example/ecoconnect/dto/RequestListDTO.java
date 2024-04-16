package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Status;
import lombok.*;

import java.util.Date;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestListDTO {
    private Long id;
    private Date dateRequestCreated;
    private String materialName;
    private String quantity;
    private String unit;
    private Status status;
    private Date dateRequestAccepted;
    private String companyName;
}
