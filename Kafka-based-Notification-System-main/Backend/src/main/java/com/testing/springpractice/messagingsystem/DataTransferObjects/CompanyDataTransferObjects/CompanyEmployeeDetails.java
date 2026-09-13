package com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyEmployeeDetails {
    private UUID id;
    private String name;
    private String username;

}
