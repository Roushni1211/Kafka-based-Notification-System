package com.testing.springpractice.messagingsystem.Controllers;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyEmployeeDetails;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CreateCompany;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.UpdateCompanyRequest;
import com.testing.springpractice.messagingsystem.Service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @PostMapping("/create")
    public CompanyResponse createCompany(@Valid @RequestPart CreateCompany createCompany,
                                         @RequestPart(required = false) MultipartFile file) throws IOException {
        return companyService.createCompany(createCompany, file);
    }

    @PostMapping("/join/{code}")
    public CompanyResponse joinCompany(@PathVariable String code){
        return companyService.joinCompany(code);
    }

    @GetMapping("/my-companies")
    public Page<CompanyResponse> getMyCompanies(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return companyService.getMyCompany(page, size);
    }

    @GetMapping("/all-companies")
    public Page<CompanyResponse> getAllCompanies(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size){
        return companyService.getAllCompany(page, size);
    }

    @GetMapping("/{companyId}")
    public CompanyInfo getInfo(@PathVariable UUID companyId){
        return companyService.getInfo(companyId);
    }

    @GetMapping("/{companyId}/members")
    public Page<CompanyEmployeeDetails> employeeDetails(@PathVariable UUID companyId, @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size){
        return companyService.getEmployeeDetails(companyId, page, size);
    }

    @PutMapping("/{companyId}")
    public CompanyResponse updateCompany(@PathVariable UUID companyId,
                                         @RequestPart(required = false) UpdateCompanyRequest updateCompanyRequest,
                                         @RequestPart(required = false) MultipartFile file
                                         ) throws IOException {
        return companyService.updateCompany(companyId, updateCompanyRequest, file);
    }

    @PostMapping("/{companyId}/accept")
    public CompanyResponse acceptInvitation(@PathVariable UUID companyId) {
        return companyService.acceptInvitation(companyId);
    }

    @DeleteMapping("/{companyId}/remove/{id}")
    public String removeEmployee(@PathVariable UUID companyId, @PathVariable UUID id) {
        return companyService.removeEmployee(companyId, id);
    }
}
