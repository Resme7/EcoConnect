package com.example.ecoconnect.controller;

import com.example.ecoconnect.dto.RequestAcceptedDTO;
import com.example.ecoconnect.dto.RequestDTO;
import com.example.ecoconnect.dto.RequestListDTO;
import com.example.ecoconnect.dto.RequestOnHoldDTO;
import com.example.ecoconnect.dto.convertor.DtoToEntity;
import com.example.ecoconnect.entities.*;
import com.example.ecoconnect.service.CompanyService;
import com.example.ecoconnect.service.MaterialService;
import com.example.ecoconnect.service.PersonService;
import com.example.ecoconnect.service.RequestService;
import com.example.ecoconnect.util.MessageContent;
import jakarta.validation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping(value = "/api/requests")
public class RequestController {

        @Autowired
        private RequestService requestService;

        @Autowired
        private MaterialService materialService;

        @Autowired
        private PersonService personService;

        @Autowired
        private CompanyService companyService;

        private final Validator validator;

        public RequestController() {
            ValidatorFactory validatorFactory = Validation.buildDefaultValidatorFactory();
            validator = validatorFactory.getValidator();
        }

        @PostMapping(value = "/{id}")
        public ResponseEntity saveRequest(@RequestBody @Valid List<RequestDTO> requestDTOList, @PathVariable Long id, BindingResult bindingResult) {
                DtoToEntity convertor = new DtoToEntity();
                Map<String, String> validations = new HashMap<>();

                checkRequestFields(requestDTOList, validations);

                if (!validations.isEmpty()) {
                        return new ResponseEntity<>(validations, HttpStatus.BAD_REQUEST);
                }

                Map<String, String> personNullMessage = new HashMap<>();
                personNullMessage.put("message", MessageContent.USER_NOT_FOUND);
                if (saveRequest(requestDTOList, id, convertor))

                        return new ResponseEntity<>(personNullMessage, HttpStatus.NOT_FOUND);

                validations.put("Results", "The requests will be created with succes.");
                return new ResponseEntity<>(validations, HttpStatus.OK);
        }
        private ResponseEntity verifyAndGetRequestsOrderedByQuantity(Long id, List<RequestListDTO> requestListDTOS, DtoToEntity convertor) {
                List<Request> requestList = requestService.getAllByUserIdOrderByQuantity(id);
                if (requestList == null || requestList.size() == 0) {
                        return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
                } else {
                        for (Request request : requestList) {
                                RequestListDTO requestsListDto = convertor.convertorRequestListEntityToRequestListDTO(request);
                                requestListDTOS.add(requestsListDto);
                        }
                }
                return new ResponseEntity<>(requestListDTOS, HttpStatus.OK);
        }

        private boolean saveRequest(List<RequestDTO> requestDTOList, Long id, DtoToEntity convertor) {
                Request request;
                Person person = personService.getByUserId(id);

                if (person == null) {
                        return true;
                }
                for (RequestDTO requestDTO : requestDTOList) {
                        Material material = materialService.getMaterialByName(requestDTO.getMaterialName());
                        request = convertor.convertRequestDtoToRequestEntity(requestDTO, material);
                        request.setPerson(person);
                        requestService.saveRequest(request);
                }
                return false;
        }
        private void checkRequestFields(List<RequestDTO> requestDtoList, Map<String, String> validations) {
                for (int i = 0; i < requestDtoList.size(); i++) {
                        RequestDTO requestDTO = requestDtoList.get(i);
                        Set<ConstraintViolation<RequestDTO>> violations = validator.validate(requestDTO);

                        if (materialService.getMaterialByName(requestDtoList.get(i).getMaterialName()) == null) {
                                validations.put("materialName" + i, MessageContent.MATERIAL_NOT_FOUND);
                        }

                        for (ConstraintViolation<RequestDTO> violation : violations) {
                                String propertyPath = violation.getPropertyPath().toString();
                                String message = violation.getMessage();
                                validations.put(propertyPath + i, message);
                        }
                }
        }
        private ResponseEntity verifyRequests(Long id, List<RequestListDTO> requestsListDTOS, DtoToEntity convertor) {
                List<Request> requestList = requestService.getAllByUserId(id);
                if (requestList == null || requestList.size() == 0) {
                        return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
                } else {
                        for (Request request : requestList) {
                                if (request.getStatus() == Status.ON_HOLD) {
                                        RequestListDTO requestListDto = convertor.convertorRequestListEntityToRequestListDTO(request);
                                        requestsListDTOS.add(requestListDto);
                                } else if (request.getStatus() == Status.PROCESSING) {
                                        RequestListDTO requestListDto = convertor.convertorRequestEntityToRequestsListDTOAccepted(request);
                                        requestsListDTOS.add(requestListDto);
                                } else if (request.getStatus() == Status.COMPLETED) {
                                        RequestListDTO requestListDto = convertor.convertorRequestEntityToRequestListDTOCompleted(request);
                                        requestsListDTOS.add(requestListDto);
                                }
                        }
                        return new ResponseEntity<>(requestsListDTOS, HttpStatus.OK);
                }
        }
        private ResponseEntity verifyRequestsOnHold(Long id, List<RequestListDTO> requestListDTOS, DtoToEntity convertor) {
                List<Request> requestList = requestService.getAllByPersonUserIdAndStatus(id, Status.ON_HOLD);
                if (requestList == null || requestList.size() == 0) {
                        return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
                } else {
                        for (Request request : requestList) {
                                RequestListDTO requestListDTO = convertor.convertorRequestListEntityToRequestListDTO(request);
                                requestListDTOS.add(requestListDTO);
                        }
                }
                return new ResponseEntity<>(requestListDTOS, HttpStatus.OK);
        }
        private ResponseEntity updateRequestOnHoldMethod(List<RequestOnHoldDTO> requestOnHoldDTOList, Company company) {
                Map<String, String> dateError = new HashMap<>();
                for (RequestOnHoldDTO requestOnHoldDto : requestOnHoldDTOList) {
                        Request requestFromDb = requestService.getRequestById(requestOnHoldDto.getId());
                        if (requestFromDb == null) {
                                Map<String, String> requestNullMessage = new HashMap<>();
                                requestNullMessage.put("message", MessageContent.REQUEST_NOT_FOUND);
                                return new ResponseEntity<>(requestNullMessage, HttpStatus.NOT_FOUND);
                        } else {
                                requestFromDb.setStatus(Status.PROCESSING);
                                Date dateAccepted = new Date(requestOnHoldDto.getDateRequestAccepted());
                                Date currentDate = new Date();

                                dateError.put("dateRequestAccepted" + requestOnHoldDto.getId(), MessageContent.INVALID_DATE);

                                if (dateAccepted.before(currentDate)) {
                                        return new ResponseEntity<>(dateError, HttpStatus.BAD_REQUEST);
                                }

                                requestFromDb.setDateRequestAccepted(dateAccepted);
                                requestFromDb.setCompany(company);

                                requestService.saveRequest(requestFromDb);
                        }
                }
                Map<String, String> requestUpdatedMessage = new HashMap<>();
                requestUpdatedMessage.put("message", MessageContent.REQUEST_UPDATED);
                return new ResponseEntity<>(requestUpdatedMessage, HttpStatus.OK);
        }

        private void checkRequestsOnHoldField(List<RequestOnHoldDTO> requestOnHoldDTOList, Map<String, String> validations) {
                for (int i = 0; i < requestOnHoldDTOList.size(); i++) {
                        RequestOnHoldDTO requestOnHoldDto = requestOnHoldDTOList.get(i);
                        Set<ConstraintViolation<RequestOnHoldDTO>> violations = validator.validate(requestOnHoldDto);

                        for (ConstraintViolation<RequestOnHoldDTO> violation : violations) {
                                String propertyPath = violation.getPropertyPath().toString();
                                String message = violation.getMessage();
                                validations.put(propertyPath + requestOnHoldDto.getId(), message);
                        }
                }
        }
        private void checkRequestsAcceptedField(RequestAcceptedDTO requestAcceptedDTO, Map<String, String> validations) {
                Set<ConstraintViolation<RequestAcceptedDTO>> violations = validator.validate(requestAcceptedDTO);

                for (ConstraintViolation<RequestAcceptedDTO> violation : violations) {
                        String propertyPath = violation.getPropertyPath().toString();
                        String message = violation.getMessage();
                        validations.put(propertyPath, message);
                }
        }

        private ResponseEntity updateRequestAcceptedMethod(RequestAcceptedDTO requestAcceptedDto) {
                Request requestFromDb = requestService.getRequestById(requestAcceptedDto.getId());
                if (requestFromDb == null) {
                        Map<String, String> requestNullMessage = new HashMap<>();
                        requestNullMessage.put("message", MessageContent.REQUEST_NOT_FOUND);
                        return new ResponseEntity<>(requestNullMessage, HttpStatus.NOT_FOUND);
                } else {
                        requestFromDb.setStatus(requestAcceptedDto.getStatus());
                        requestService.saveRequest(requestFromDb);
                }
                Map<String, String> requestUpdatedMessage = new HashMap<>();
                requestUpdatedMessage.put("message",MessageContent.REQUEST_UPDATED);
                return new ResponseEntity<>(requestUpdatedMessage, HttpStatus.OK);
        }
}
