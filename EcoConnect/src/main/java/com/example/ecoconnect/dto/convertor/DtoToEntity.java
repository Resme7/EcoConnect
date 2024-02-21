package com.example.ecoconnect.dto.convertor;

import com.example.ecoconnect.dto.*;
import com.example.ecoconnect.entities.*;

import java.util.Date;
import java.util.List;

public class DtoToEntity {
    public Person convertorPersonDtoToEntity(PersonDTO personDTO){
        Person person = new Person();
        person.setFirstName(personDTO.getFirstName());
        person.setLastName(personDTO.getLastName());
        person.setPhoneNumberPerson(personDTO.getNumberPhone());
        person.setLatitude(personDTO.getLatitude());
        person.setLongitude(person.getLongitude());
        StringBuilder addressFull = new StringBuilder();
        addressFull.append(personDTO.getStreet()).append(", ").append(personDTO.getNumber()).append(", ")
                .append(personDTO.getBuilding()).append(", ").append(personDTO.getEntrance()).append(", ")
                .append(personDTO.getApartNumber());
        person.setPersonAddress(addressFull.toString());

        return person;
    }
    public PersonNearbyDTO convertorPersonEntityToPersonNearbyDto(Person person) {
        PersonNearbyDTO personNearbyDTO = new PersonNearbyDTO();
        personNearbyDTO.setName(person.getFirstName() + " " + person.getLastName());
        personNearbyDTO.setLongitude(person.getLongitude());
        personNearbyDTO.setLatitude(person.getLatitude());
        personNearbyDTO.setRole(person.getUser().getRole());

        return personNearbyDTO;
    }

    public Company convertorCompanyDtoToEntity(CompanyDTO companyDTO) {
        Company company = new Company();
        company.setCompanyNumberPhone(companyDTO.getCompanyNumberPhone());
        company.setName(companyDTO.getCompanyName());
        StringBuilder fullAddress = new StringBuilder();
        fullAddress.append(companyDTO.getStreet()).append(", ").append(companyDTO.getNumber()).append(", ")
                .append(companyDTO.getBuilding()).append(", ")
                .append(companyDTO.getEntrance()).append(", ").
                append(companyDTO.getApartNumber());
        company.setCompanyAddress(fullAddress.toString());
        company.setDescription(companyDTO.getDescriptionCompany());
        company.setLatitude(companyDTO.getLatitude());
        company.setLongitude(companyDTO.getLongitude());
        company.setCompanyCode(companyDTO.getCompanyCode());
        return company;
    }
    public CompanyDetailDTO convertorCompanyDetailDtoToCompanyEntity(Company company, User user) {
        CompanyDetailDTO companyDetailsDto = new CompanyDetailDTO();
        companyDetailsDto.setId(user.getUserId());
        companyDetailsDto.setRole(user.getRole());
        companyDetailsDto.setCompanyName(company.getCompanyName());
        companyDetailsDto.setCompanyAddress(company.getCompanyAddress());
        companyDetailsDto.setCompanyNumberPhone(company.getCompanyNumberPhone());
        companyDetailsDto.setEmail(user.getEmail());
        companyDetailsDto.setDescription(company.getDescription());
        companyDetailsDto.setCompanyCode(company.getCompanyCode());
        companyDetailsDto.setLatitude(company.getLatitude());
        companyDetailsDto.setLongitude(company.getLongitude());

        return companyDetailsDto;
    }
    public CompanyDetailPracticeDTO convertorCompanyEntityToCompanyDetailPracticeDTO(Company company, List<String> materials) {
        CompanyDetailPracticeDTO companyDetailPracticeDTO = new CompanyDetailPracticeDTO();
        companyDetailPracticeDTO.setAddress(company.getCompanyAddress());
        companyDetailPracticeDTO.setCompanyName(company.getName());
        companyDetailPracticeDTO.setCompanyNumberPhone(company.getCompanyNumberPhone());
        companyDetailPracticeDTO.setEmail(company.getUser().getEmail());
        companyDetailPracticeDTO.setMaterialList(materials);
        companyDetailPracticeDTO.setLatitude(company.getLatitude());
        companyDetailPracticeDTO.setLongitude(company.getLongitude());
        companyDetailPracticeDTO.setRole(company.getUser().getRole());

        return companyDetailPracticeDTO;
    }
    public CollectionStationDTO convertorCompanyEntityToCollectionStationDto(Company company) {
        CollectionStationDTO collectionStationsDto = new CollectionStationDTO();

        collectionStationsDto.setName(company.getName());
        collectionStationsDto.setLatitude(company.getLatitude());
        collectionStationsDto.setLongitude(company.getLongitude());

        return collectionStationsDto;
    }

    public User convertorUserDtoToUserEntity(UserDTO userDto) {
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setRole(userDto.getRole());
        return user;
    }

    public Material convertorMaterialDtoToMaterialEntity(MaterialDTO materialDto) {
        Material material = new Material();
        material.setMaterialName(materialDto.getMaterialName());
        return material;
    }

    public MaterialDTO convertorMaterialEntityToMaterialDto(Material material) {
        MaterialDTO materialDto = new MaterialDTO();
        materialDto.setMaterialName(material.getMaterialName());
        return materialDto;
    }
    public Request convertRequestDtoToRequestEntity(RequestDTO requestDto, Material material) {
        Request request = new Request();
        Date dateRequestCreated = new Date();
        request.setDateRequestCreated(dateRequestCreated);
        request.setStatus(Status.ON_HOLD);
        request.setQuantity(requestDto.getQuantity());
        request.setUnit(requestDto.getUnit());

        request.setMaterial(material);

        return request;
    }


}
