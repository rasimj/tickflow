package com.ticketflow.ticketflow.repository;

import com.ticketflow.ticketflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRoleAndAccountStatus(User.Role role, User.AccountStatus accountStatus);
}