package com.access.auth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.access.auth.entities.UserEntity;

public interface UserRepo extends JpaRepository<UserEntity, Long> {

	UserEntity findByEmail(String email);

	UserEntity findByUserName(String username);

}
