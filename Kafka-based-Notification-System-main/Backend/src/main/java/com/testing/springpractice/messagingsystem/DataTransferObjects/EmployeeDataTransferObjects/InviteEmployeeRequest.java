package com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InviteEmployeeRequest {
    @NotBlank
    public String username;
}
