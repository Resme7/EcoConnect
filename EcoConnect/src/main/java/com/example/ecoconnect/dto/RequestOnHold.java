package com.example.ecoconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RequestOnHold {
    @NotNull(message = "Required")
    private Long id;

    @NotNull(message = "Required")
    private Long dateRequestAccepted;
}
