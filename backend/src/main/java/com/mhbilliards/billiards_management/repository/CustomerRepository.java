package com.mhbilliards.billiards_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mhbilliards.billiards_management.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {
    @Query("SELECT c FROM Customer c WHERE LOWER(c.email) = LOWER(:email) AND c.id != :id")
    Optional<Customer> findByEmailIgnoreCaseAndIdNot(@Param("email") String email, @Param("id") Long id);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.phoneNumber) = LOWER(:phoneNumber) AND c.id != :id")
    Optional<Customer> findByPhoneNumberIgnoreCaseAndIdNot(@Param("phoneNumber") String phoneNumber,
            @Param("id") Long id);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.email) = LOWER(:email)")
    Optional<Customer> findByEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.phoneNumber) = LOWER(:phoneNumber)")
    Optional<Customer> findByPhoneNumberIgnoreCase(@Param("phoneNumber") String phoneNumber);

    @Query("SELECT c FROM Customer c WHERE c.id = :id")
    Optional<Customer> findDetailedById(@Param("id") Long id);
}
