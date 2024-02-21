package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Company findByCompanyId(Long companyId);

    Company findByCompanyCode(String companyCode);

    Company findByCompanyNumberPhone(String companyNumberPhone);
}
