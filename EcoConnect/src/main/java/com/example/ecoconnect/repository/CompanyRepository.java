package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Company findByCompanyId(Long companyId);

    Company findByCompanyCode(String companyCode);

    Company findByCompanyNumberPhone(String companyNumberPhone);

    Company findByUserUserId(Long userId);

    @Query("from Company c join c.materialList ml where ml.materialName = :materialName")
    List<Company> findByMaterial(String materialName);
}
