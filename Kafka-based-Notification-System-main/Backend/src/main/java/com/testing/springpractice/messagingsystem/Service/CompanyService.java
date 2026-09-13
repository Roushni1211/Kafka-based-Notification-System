package com.testing.springpractice.messagingsystem.Service;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyEmployeeDetails;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CreateCompany;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.UpdateCompanyRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface CompanyService {
    CompanyResponse createCompany(@Valid CreateCompany createCompany, MultipartFile file) throws IOException;

    CompanyResponse joinCompany(String code);

    Page<CompanyResponse> getMyCompany(int page, int size);

    Page<CompanyResponse> getAllCompany(int page, int size);

    CompanyInfo getInfo(UUID companyId);

    CompanyResponse updateCompany(UUID companyId, UpdateCompanyRequest request, MultipartFile file) throws IOException;

    Page<CompanyEmployeeDetails> getEmployeeDetails(UUID companyId, int page, int size);

    CompanyResponse acceptInvitation(UUID companyId);

    String removeEmployee(UUID companyId, UUID employeeId);
}
