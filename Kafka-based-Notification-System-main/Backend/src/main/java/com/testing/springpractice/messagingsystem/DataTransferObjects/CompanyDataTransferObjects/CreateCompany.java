package com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompany {
    @NotNull
    private String name;

}
