package com.example.ecoconnect.dto;

import com.example.ecoconnect.entities.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RequestAcceptedDTO {
    @NotNull(message = "Required")
    private Long id;

    @NotNull(message = "Required")
    private Status status;
}
