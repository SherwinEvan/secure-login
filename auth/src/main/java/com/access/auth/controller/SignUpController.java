package com.access.auth.controller;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.access.auth.entities.UserEntity;
import com.access.auth.entities.VerificationToken;
import com.access.auth.event.RegistrationCompleteEvent;
import com.access.auth.models.PasswordModel;
import com.access.auth.models.UserModel;
import com.access.auth.signupservice.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@Slf4j
public class SignUpController {

	@Autowired
	private UserService userService;

	@Autowired
	private ApplicationEventPublisher publisher;

	@GetMapping
	public String land() {
		return "Hello!";
	}

	
	@GetMapping("/test")
	public String test() {
		return "Hello! This is a test.";
	}

	@PostMapping("/signup")
	public String registerUser(@RequestBody UserModel userModel, final HttpServletRequest request) {
		UserEntity user = userService.registerUser(userModel);
		
		RegistrationCompleteEvent registrationCompleteEvent = new RegistrationCompleteEvent(user, applicationUrl(request));

		publisher.publishEvent(registrationCompleteEvent);
		
		String url = registrationCompleteEvent.getApplicationUrl() + "/auth/verifyRegistration?token=" + userService.getTokenByUser(user);
		
		if(url == null)
			return "Error generating activation link.";
		
		return url;
	}

	@GetMapping("/verifyRegistration")
	public String verifyRegistration(@RequestParam("token") String token) {
		boolean validity = userService.validateVerificationToken(token);

		if(validity) {
			return "User verified successfully!";
		}

		return "Bad token request";
	}

	@GetMapping("/resendVerificationLink")
	private String resendVerificationLink(@RequestParam("token") String oldToken, HttpServletRequest request) {

		VerificationToken verificationToken = userService.generateNewVerificationToken(oldToken);
		UserEntity user = verificationToken.getUser();
		resendVerificationToken(user, applicationUrl(request), verificationToken);
		return "Verification Link Sent";
	}
	
	@PostMapping("/resetPassword")
	public String resetPassword(@RequestBody PasswordModel passwordModel, HttpServletRequest request) {
		UserEntity user = userService.findUserByEmail(passwordModel.getEmail());
		String url = "";
		if(user != null) {
			String token = UUID.randomUUID().toString();
			userService.createPasswordResetTokenForUser(user, token);
			url = passwordResetTokenMail(user, applicationUrl(request), token);
		}
		return url; 
	}
	
	@PostMapping("/savePassword")
	public String savePassword(@RequestBody PasswordModel passwordModel) {
		
		if(userService.validatePasswordResetToken(passwordModel.getOldToken())) {
			return "Bad ttttoken";
			}
		Optional<UserEntity> user = userService.getUserByPasswordResetToken(passwordModel.getOldToken());
		
		if(user.isPresent()) {
			userService.changePassword(user.get(), passwordModel.getNewPassword());
			return "Password Reset Successfully!";
		}
		
		return "Bad token";
	}
	
	@PostMapping("/changePassword")
	public String changePassword(@RequestBody PasswordModel passwordModel) {
		UserEntity user = userService.findUserByEmail(passwordModel.getEmail());
		
		if(!userService.checkIfValidOldPassword(user, passwordModel.getOldPassword())) {
			return "Invalid Old Password";
		}
		
		userService.changePassword(user, passwordModel.getNewPassword());
		return "Password Change Successful";
	}

	private String passwordResetTokenMail(UserEntity user, String applicationUrl, String token) {
		String url = applicationUrl + "/auth/savePassword?token=" + token;

		log.info("Click the link to reset password : {}", url);
		
		return url;
	}

	private String applicationUrl(HttpServletRequest request) {
		return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	}

	public void resendVerificationToken(UserEntity user, String applicationUrl, VerificationToken verificationToken) {
		String url = applicationUrl + "/auth/verifyRegistration?token=" + verificationToken.getToken();

		log.info("Click the link to verify your account : {}", url);
	}
}
