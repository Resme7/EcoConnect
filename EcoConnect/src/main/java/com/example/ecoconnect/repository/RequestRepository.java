package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Request;
import com.example.ecoconnect.entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    Request findRequestById(Long requestId);

    @Query("SELECT r FROM Request r JOIN FETCH r.material WHERE r.person.personId = :personId")
    List<Request> findAllByPersonPersonIdWithMaterial(@Param("personId") Long personId);

    List<Request> findAllByPersonPersonId(Long personId);

    List<Request> findAllByPersonUserUserId(Long userId);

    List<Request> findAllByCompanyUserUserIdAndStatus(Long userId, Status status);

    List<Request> findAllByPersonUserUserIdAndStatus(Long userId, Status status);

    List<Request> findAllByPersonUserUserIdOrderByQuantity(Long citizenId);
}
