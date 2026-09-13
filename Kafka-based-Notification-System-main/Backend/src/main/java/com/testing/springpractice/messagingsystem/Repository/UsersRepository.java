package com.testing.springpractice.messagingsystem.Repository;

import com.testing.springpractice.messagingsystem.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {

    Optional<Users> findByUsername(String username);
    Boolean existsByUsername(String username);

    @Modifying
    @Transactional
    @Query("update Users u " +
            "set u.password = :password " +
            "where u.username = :username")
    int updatePasswordForUsername(String password,String username);


}
