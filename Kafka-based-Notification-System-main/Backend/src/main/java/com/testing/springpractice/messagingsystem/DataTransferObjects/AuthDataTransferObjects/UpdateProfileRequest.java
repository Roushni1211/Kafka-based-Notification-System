package com.testing.springpractice.messagingsystem.DataTransferObjects.AuthDataTransferObjects;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UpdateProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;
}
