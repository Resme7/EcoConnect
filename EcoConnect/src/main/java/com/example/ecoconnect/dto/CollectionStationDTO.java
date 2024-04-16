package com.example.ecoconnect.dto;


import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollectionStationDTO {
    private String name;
    private String latitude;
    private String longitude;
}
