package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Request;
import com.example.ecoconnect.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    Request findRequestById(Long requestId);

    List<Request> findAllByPersonPersonId(Long personId);

    List<Request> findAllByPersonUserUserId(Long userId);

    List<Request> findAllByCompanyUserUserIdAndStatus(Long userId, Status status);

    List<Request> findAllByPersonUserUserIdAndStatus(Long userId, Status status);

    List<Request> findAllByPersonUserUserIdOrderByQuantity(Long citizenId);
}
