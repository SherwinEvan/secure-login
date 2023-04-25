package com.access.auth.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.access.auth.entities.UserEntity;
import com.access.auth.loginservice.TokenService;
import com.access.auth.models.UserModel;
import com.access.auth.repositories.UserRepo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
@RestController
@RequestMapping("/login")
public class LoginController {

	private final TokenService tokenService;

	private final UserRepo userRepo;

	private final AuthenticationManager authenticationManager;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public LoginController(TokenService tokenService, AuthenticationManager authenticationManager, UserRepo userRepo,
			PasswordEncoder passwordEncoder) {
		this.tokenService = tokenService;
		this.authenticationManager = authenticationManager;
		this.userRepo = userRepo;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/")
	public ResponseEntity<?> token(@RequestBody UserModel loginUser, HttpServletResponse response) throws Exception {

		UserEntity userEntity = userRepo.findByUserName(loginUser.getUserName());
		if (userEntity.getUserName() != null) {
			if (!userEntity.isEnabled())
				return ResponseEntity.ok("Activate your account!");

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(userEntity.getUserName(), userEntity.getPassword()));
			
			String accessToken = tokenService.generateToken(authentication);
			
			Cookie cookie = new Cookie("access_token", accessToken);
		    cookie.setMaxAge(864000); // Set cookie to expire in 1 hour
		    cookie.setPath("/");
		    cookie.setHttpOnly(true);
		    response.addCookie(cookie);

			return ResponseEntity.ok("Login successful");

			/*
			 * String enteredPassword = passwordEncoder.encode(loginUser.getPassword());
			 * log.info(userEntity.getUserName()); log.info(userEntity.getPassword());
			 * log.info(loginUser.getUserName()); log.info(loginUser.getPassword());
			 * log.info(enteredPassword);
			 * 
			 * try { return tokenService.generateToken(authenticationManager.authenticate(
			 * new UsernamePasswordAuthenticationToken(userEntity.getUserName(),
			 * userEntity.getPassword()))); } catch (BadCredentialsException e) { throw new
			 * Exception("Incorrect username or password", e); } return
			 * "Invalid Credentials!";
			 */

		}
		return ResponseEntity.ok("Invalid Credentials!");
	}

	@GetMapping("/")
	public String home(Principal principal) {
		return "Hello " + principal.getName();
	}
}
