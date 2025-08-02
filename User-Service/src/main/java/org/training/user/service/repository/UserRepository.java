package org.training.user.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.training.user.service.model.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByAuthId(String authId);

    Optional<User> findByEmailId(String emailId);

    Optional<User> findByContactNo(String contactNo);

    Optional<User> findByIdentificationNumber(String identificationNumber);

    @Query("SELECT u FROM User u JOIN u.userProfile up WHERE u.userId = :userId")
    Optional<User> findUserWithProfile(Long userId);
}
