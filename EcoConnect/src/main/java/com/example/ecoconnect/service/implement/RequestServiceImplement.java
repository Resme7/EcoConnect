package com.example.ecoconnect.service.implement;

import com.example.ecoconnect.entities.Request;
import com.example.ecoconnect.entities.Status;
import com.example.ecoconnect.repository.RequestRepository;
import com.example.ecoconnect.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestServiceImplement implements RequestService {

    @Autowired
    RequestRepository requestRepository;

    @Override
    public Request getRequestById(Long requestId) {
        return requestRepository.findRequestById(requestId);
    }

    @Override
    public Request saveRequest(Request request) {
        return requestRepository.save(request);
    }

    @Override
    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
    @Override
    public List<Request> getAllByPersonIdMaterial(Long personId) {
        return requestRepository.findAllByPersonPersonIdWithMaterial(personId);
    }


    @Override
    public List<Request> getAllByPersonId(Long id) {
        return requestRepository.findAllByPersonPersonId(id);
    }

    @Override
    public List<Request> getAllByUserId(Long id) {
        return requestRepository.findAllByPersonUserUserId(id);
    }

    @Override
    public List<Request> getAllByCompanyUserIdAndStatus(Long id, Status status) {
        return requestRepository.findAllByCompanyUserUserIdAndStatus(id, status);
    }

    @Override
    public List<Request> getAllByPersonUserIdAndStatus(Long id, Status status) {
        return requestRepository.findAllByPersonUserUserIdAndStatus(id, status);
    }

    @Override
    public List<Request> getAllByUserIdOrderByQuantity(Long id) {
        return requestRepository.findAllByPersonUserUserIdOrderByQuantity(id);
    }
}
