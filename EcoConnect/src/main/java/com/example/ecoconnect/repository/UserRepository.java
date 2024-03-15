package com.example.ecoconnect.repository;

import com.example.ecoconnect.entities.Role;
import com.example.ecoconnect.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    List<User> findByRole(Role role);

    void deleteByEmail(String email);

    User findByUserId(Long id);

    User findByPersonPersonId(Long id_person);

    User findByCompanyCompanyId(Long id_company);
}
