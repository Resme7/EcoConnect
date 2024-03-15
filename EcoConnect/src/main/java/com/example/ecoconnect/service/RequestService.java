package com.example.ecoconnect.service;

import com.example.ecoconnect.entities.Request;
import com.example.ecoconnect.entities.Status;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RequestService {
    Request getRequestById(Long requestId);

    Request saveRequest(Request request);

    void deleteRequest(Long id);

    List<Request> getAllByPersonId(Long id);

    List<Request> getAllByUserId(Long id);

    List<Request> getAllByCompanyUserIdAndStatus(Long id, Status status);

    List<Request> getAllByPersonUserIdAndStatus(Long id, Status status);

    List<Request> getAllByUserIdOrderByQuantity(Long id);
}

