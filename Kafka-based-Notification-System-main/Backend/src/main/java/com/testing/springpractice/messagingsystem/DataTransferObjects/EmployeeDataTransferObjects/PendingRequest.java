package com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingRequest {
    private String query;
}
