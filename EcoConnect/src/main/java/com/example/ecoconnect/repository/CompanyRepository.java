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

    @Query("select c.id from Company c join c.materialList ml where ml.materialName = :materialName")
    List<Long> findByMaterialName(String materialName);

    @Query("select m.id from Material m join m.companyList cl where cl.id = :companyId")
    List<Long> findMaterialIdsByCompanyId(Long companyId);
}
