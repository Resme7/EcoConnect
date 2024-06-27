package com.example.ecoconnect.service;

import com.example.ecoconnect.entities.Company;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CompanyService {

    Company getCompanyById(Long companyId);

    Company getByUserId(Long userId);

    Company getCompanyByCompanyCode(String companyCode);

    Company getCompanyByNumberPhone(String companyNumberPhone);

    Company saveCompany(Company company);

    List<Long> getCompanyByMaterialName(String materialName);

    List<Long> getMaterialIdsByCompanyId(Long companyId);
}
