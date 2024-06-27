package com.example.ecoconnect.service;

import com.example.ecoconnect.entities.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    User getByEmail(String email);

    User saveUser(User user);

    User getUserById(Long id);

    User getByPersonId(Long id);

    User getByCompanyId(Long id);

    void deleteUserById(Long id);
}
