package com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCompanyRequest {
    private String name;
}
