package com.testing.springpractice.messagingsystem.Service;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.CompanyInvitations;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.InviteEmployeeRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface EmployeeService {
    String inviteEmployee(UUID companyId, @Valid InviteEmployeeRequest request);

    Page<CompanyInvitations> getAllInvitations(int page, int size);

    CompanyInfo getInvitationCompanyInfo(UUID companyId);
}
