package com.example.ecoconnect.entities;

import jakarta.persistence.*;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "general_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email", nullable = false)
    private String email;

    @Column(name = "user_password", nullable = false)
    private String password;

    @Enumerated
    @Column(name = "user_role")
    private Role role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Person person;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Company company;
}
