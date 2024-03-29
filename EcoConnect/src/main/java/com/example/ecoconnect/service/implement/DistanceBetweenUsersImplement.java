package com.example.ecoconnect.service.implement;

import com.example.ecoconnect.entities.Company;
import com.example.ecoconnect.entities.Person;
import com.example.ecoconnect.entities.Status;
import com.example.ecoconnect.repository.CompanyRepository;
import com.example.ecoconnect.repository.PersonRepository;
import com.example.ecoconnect.service.DistanceBetweenUsers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

public class DistanceBetweenUsersImplement implements DistanceBetweenUsers {
    private final static Double RADIUS = 3d;
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public Double CalculateDistanceBetweenTwoPoints(Double lat1, Double lon1, Double lat2, Double lon2) {
        Double earthRadius = 6371.0;
        double dLatitude = Math.toRadians(lat2-lat1);
        double dLongitude = Math.toRadians(lon2-lon1);

        double firstPointLat = Math.toRadians(lat1);
        double secondPointLat = Math.toRadians(lat2);

        double rez = Math.pow(Math.sin(dLatitude/2), 2) + Math.pow(Math.sin(dLongitude/2), 2)* Math.cos(firstPointLat)*Math.cos(secondPointLat);
        double result = 2*Math.asin(Math.sqrt(rez));
        return earthRadius * result;
    }

    @Override
    public List<Person> getAllNearbyPersonWithStatusOnHold(Double latitude, Double longitude) {
        List<Person> nearbyPerson = new ArrayList<>();
        for(Person person : personRepository.findAllPersonByRequestStatus(Status.ON_HOLD)){
            Double latitudePerson = Double.parseDouble(person.getLatitude());
            Double longitudePerson = Double.parseDouble(person.getLongitude());

            if(CalculateDistanceBetweenTwoPoints(latitude, longitude, latitudePerson, longitudePerson) < RADIUS &&
                    CalculateDistanceBetweenTwoPoints(latitude, longitude, latitudePerson, longitudePerson) !=0){
                nearbyPerson.add(person);
            }
        }

        return nearbyPerson;
    }

    @Override
    public List<Company> getAllNearbyCompany(Double latitude, Double longitude) {
        List<Company> nearbyCompany = new ArrayList<>();
        for(Company company : companyRepository.findAll()){
            Double latitudeCompany = Double.parseDouble(company.getLatitude());
            Double longitudeCompany = Double.parseDouble(company.getLongitude());
            if(CalculateDistanceBetweenTwoPoints(latitude, longitude, latitudeCompany, longitudeCompany) < RADIUS &&
                    CalculateDistanceBetweenTwoPoints(latitude, longitude, latitudeCompany, longitudeCompany) !=0){
                nearbyCompany.add(company);
            }
        }
        return nearbyCompany;
    }
}
