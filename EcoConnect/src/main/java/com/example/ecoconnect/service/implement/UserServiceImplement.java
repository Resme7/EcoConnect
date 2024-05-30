package com.example.ecoconnect.service.implement;

import com.example.ecoconnect.entities.User;
import com.example.ecoconnect.repository.UserRepository;
import com.example.ecoconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImplement implements UserService {

    @Autowired
    UserRepository userRepository;


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User saveUser(User user) {
        //criptare
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findByUserId(id);
    }

    @Override
    public User getByPersonId(Long id) {
        return userRepository.findByPersonPersonId(id);
    }

    @Override
    public User getByCompanyId(Long id) {
        return userRepository.findByCompanyCompanyId(id);
    }
}
