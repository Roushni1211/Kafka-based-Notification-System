package com.testing.springpractice.messagingsystem.Repository;

import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyEmployeeDetails;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo;
import com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyResponse;
import com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.CompanyInvitations;
import com.testing.springpractice.messagingsystem.Models.Company;
import com.testing.springpractice.messagingsystem.Models.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByJoinCode(String joinCode);

    @Query("select new com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyResponse( " +
            "c.id," +
            "c.name," +
            "c.joinCode," +
            "c.companyDpUrl," +
            "c.owner.id) from Company as c where c.owner.id = :ownerId " +
            "order by c.createdAt desc ")
    Page<CompanyResponse> findCompaniesByOwnerId(UUID ownerId, Pageable pageable);

    @Query("SELECT DISTINCT u FROM Company c " +
            "LEFT JOIN c.emp e " +
            "JOIN Users u ON (u = c.owner OR u = e) " +
            "WHERE c.id = :companyId AND u.id IN :receiverIds")
    List<Users> findValidCompanyMembers(UUID companyId, Collection<UUID> receiverIds);
    @Query("select new com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyResponse( " +
            "c.id," +
            "c.name," +
            "c.joinCode," +
            "c.companyDpUrl," +
            "c.owner.id) from Company as c join c.emp e where e.id = :userId " +
            "order by c.createdAt desc ")
    Page<CompanyResponse> findAllCompaniesByOwnerId(UUID userId, Pageable pageable);

    @Query("select new com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo( " +
            "c.id," +
            "c.name," +
            "c.joinCode," +
            "c.companyDpUrl," +
            "c.owner.id," +
            "c.owner.name, " +
            "c.createdAt ) from Company c join c.emp e where e.id = :empId AND c.id = :companyId order by c.createdAt desc ")
    Optional<CompanyInfo> findCompanyUsingEmpIdAndCompanyId(UUID empId, UUID companyId);
    @Query("select new com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyEmployeeDetails(" +
            "e.id," +
            "e.name," +
            "e.username) from Company c join c.emp e where c.id = :companyId order by e.name asc")
    Page<CompanyEmployeeDetails> ObtainDetailsOfEmployeesUsingCompanyId(UUID companyId, Pageable pageable);

    @Query("select new com.testing.springpractice.messagingsystem.DataTransferObjects.EmployeeDataTransferObjects.CompanyInvitations(" +
            "c.id," +
            "c.name, " +
            "c.companyDpUrl" +
            ")" +
            "from Company c join c.invitations e where e.id = :userId order by c.createdAt desc ")
    Page<CompanyInvitations> obtainInvitationsForUserId(UUID userId, Pageable pageable);

    @Query("select new com.testing.springpractice.messagingsystem.DataTransferObjects.CompanyDataTransferObjects.CompanyInfo(" +
            "c.id, " +
            "c.name, " +
            "'Not Visible unless joined', " +
            "c.companyDpUrl, " +
            "c.owner.id, " +
            "c.owner.name, " +
            "c.createdAt) " +
            "from Company c join c.invitations inv " +
            "where inv.id = :userId AND c.id = :companyId")
    Optional<CompanyInfo> findCompanyUsingInvitedUserIdAndCompanyId(UUID userId, UUID companyId);
}
