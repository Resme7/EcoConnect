package com.example.ecoconnect.dto.convertor;

import com.example.ecoconnect.dto.*;
import com.example.ecoconnect.entities.*;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Builder
@NoArgsConstructor
public class DtoToEntity {
    public Person convertorPersonDtoToEntity(PersonDTO personDTO) {
        return Person.builder()
                .firstName(personDTO.getFirstName())
                .lastName(personDTO.getLastName())
                .phoneNumberPerson(personDTO.getNumberPhone())
                .latitude(personDTO.getLatitude())
                .longitude(personDTO.getLongitude())
                .personAddress(buildAddress(personDTO))
                .build();
    }

    private String buildAddress(PersonDTO personDTO) {
        return new StringBuilder()
                .append(personDTO.getStreet()).append(", ")
                .append(personDTO.getNumber()).append(", ")
                .append(personDTO.getBuilding()).append(", ")
                .append(personDTO.getEntrance()).append(", ")
                .append(personDTO.getApartNumber())
                .toString();
    }

    public PersonDetailDTO convertorPersonDetailDtoToEntity(Person person, User user) {
        return PersonDetailDTO.builder()
                .id(user.getUserId())
                .role(user.getRole())
                .personAddress(person.getPersonAddress())
                .numberPhone(person.getPhoneNumberPerson())
                .email(user.getEmail())
                .firstName(person.getFirstName())
                .lastName(person.getLastName())
                .latitude(person.getLatitude())
                .longitude(person.getLongitude())
                .build();
    }

    public PersonNearbyDTO convertorPersonEntityToPersonNearbyDTO(Person person) {
        return PersonNearbyDTO.builder()
                .name(person.getFirstName() + " " + person.getLastName())
                .longitude(person.getLongitude())
                .latitude(person.getLatitude())
                .role(person.getUser().getRole())
                .build();
    }

    public Company convertorCompanyDtoToEntity(CompanyDTO companyDTO) {
        return Company.builder()
                .companyNumberPhone(companyDTO.getCompanyNumberPhone())
                .companyName(companyDTO.getCompanyName())
                .companyAddress(buildCompanyAddress(companyDTO))
                .description(companyDTO.getDescriptionCompany())
                .latitude(companyDTO.getLatitude())
                .longitude(companyDTO.getLongitude())
                .companyCode(companyDTO.getCompanyCode())
                .build();
    }

    private String buildCompanyAddress(CompanyDTO companyDTO) {
        return new StringBuilder()
                .append(companyDTO.getStreet()).append(", ")
                .append(companyDTO.getNumber()).append(", ")
                .append(companyDTO.getBuilding()).append(", ")
                .append(companyDTO.getEntrance()).append(", ")
                .append(companyDTO.getApartNumber())
                .toString();
    }

    public CompanyDetailDTO convertorCompanyDetailDtoToEntity(Company company, User user) {
        return CompanyDetailDTO.builder()
                .id(user.getUserId())
                .role(user.getRole())
                .companyName(company.getCompanyName())
                .companyAddress(company.getCompanyAddress())
                .companyNumberPhone(company.getCompanyNumberPhone())
                .email(user.getEmail())
                .description(company.getDescription())
                .companyCode(company.getCompanyCode())
                .latitude(company.getLatitude())
                .longitude(company.getLongitude())
                .build();
    }

    public CompanyDetailPracticeDTO convertorCompanyEntityToCompanyDetailPracticeDTO(Company company, List<String> materials) {
        return CompanyDetailPracticeDTO.builder()
                .address(company.getCompanyAddress())
                .companyName(company.getName())
                .companyNumberPhone(company.getCompanyNumberPhone())
                .email(company.getUser().getEmail())
                .materialList(materials)
                .latitude(company.getLatitude())
                .longitude(company.getLongitude())
                .role(company.getUser().getRole())
                .build();
    }

    public CollectionStationDTO convertorCompanyEntityToCollectionStationDto(Company company) {
        return CollectionStationDTO.builder()
                .name(company.getName())
                .latitude(company.getLatitude())
                .longitude(company.getLongitude())
                .build();
    }

    public User convertorUserDtoToUserEntity(UserDTO userDto) {
        return User.builder()
                .email(userDto.getEmail())
                .password(userDto.getPassword())
                .role(userDto.getRole())
                .build();
    }

    public Material convertorMaterialDtoToMaterialEntity(MaterialDTO materialDto) {
        return Material.builder()
                .materialName(materialDto.getMaterialName())
                .build();
    }

    public MaterialDTO convertorMaterialEntityToMaterialDto(Material material) {
        return MaterialDTO.builder()
                .materialName(material.getMaterialName())
                .build();
    }

    public Request convertRequestDtoToRequestEntity(RequestDTO requestDto, Material material) {
        return Request.builder()
                .dateRequestCreated(new Date())
                .status(Status.ON_HOLD)
                .quantity(requestDto.getQuantity())
                .unit(requestDto.getUnit())
                .material(material)
                .build();
    }

    public RequestListDTO convertorRequestListEntityToRequestListDTO(Request request) {
        return RequestListDTO.builder()
                .id(request.getId())
                .dateRequestCreated(request.getDateRequestCreated())
                .quantity(request.getQuantity())
                .status(request.getStatus())
                .unit(request.getUnit())
                .materialName(request.getMaterial().getMaterialName())
                .build();
    }

    public RequestListDTO convertorRequestEntityToRequestsListDTOAccepted(Request request) {
        return RequestListDTO.builder()
                .id(request.getId())
                .dateRequestAccepted(request.getDateRequestAccepted())
                .companyName(request.getCompany().getCompanyName())
                .build();
    }

    public RequestListDTO convertorRequestEntityToRequestListDTOCompleted(Request request) {
        return RequestListDTO.builder()
                .id(request.getId())
                .dateRequestAccepted(request.getDateRequestAccepted())
                .companyName(request.getCompany().getCompanyName())
                .build();
    }

    public OrderListDTO convertorRequestEntityToOrderListDTO(Request request) {
        return OrderListDTO.builder()
                .id(request.getId())
                .dateCreated(request.getDateRequestCreated())
                .dateCollection(request.getDateRequestAccepted())
                .address(request.getPerson().getPersonAddress())
                .phoneNumber(request.getPerson().getPhoneNumberPerson())
                .materialName(request.getMaterial().getMaterialName())
                .quantity(request.getQuantity())
                .personName(request.getPerson().getFirstName() + " " + request.getPerson().getLastName())
                .unit(request.getUnit())
                .build();
    }


}
