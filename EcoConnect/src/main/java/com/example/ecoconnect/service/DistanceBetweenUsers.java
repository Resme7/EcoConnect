package com.example.ecoconnect.service;

import com.example.ecoconnect.entities.Company;
import com.example.ecoconnect.entities.Person;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DistanceBetweenUsers {
    Double CalculateDistanceBetweenTwoPoints(Double lat1, Double lon1, Double lat2, Double lon2);

    List<Person> getAllNearbyPersonWithStatusOnHold(Double latitude, Double longitude);

    List<Company> getAllNearbyCompany(Double latitude, Double longitude);
}
