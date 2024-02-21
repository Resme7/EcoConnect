package com.example.ecoconnect.service.implement;

import com.example.ecoconnect.entities.Company;
import com.example.ecoconnect.repository.CompanyRepository;
import com.example.ecoconnect.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImplement implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public List<Company> getAllCompanies(){
        return companyRepository.findAll();
    }

    @Override
    public Company getCompanyById(Long companyId){
        return companyRepository.findByCompanyId(companyId);
    }
    @Override
    public Company getCompanyByCompanyCode(String companyCode){
        return companyRepository.findByCompanyCode(companyCode);
    }
    @Override
    public Company getCompanyByNumberPhone(String companyNumberPhone){
        return companyRepository.findByCompanyNumberPhone(companyNumberPhone);
    }
    @Override
    public Company saveCompany(Company company){
        return companyRepository.save(company);
    }
}
