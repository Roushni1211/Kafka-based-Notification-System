package com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects;

import com.testing.springpractice.messagingsystem.Models.Users;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyInvitations {
    private UUID id;
    private String name;
    private String companyDpUrl;

}
