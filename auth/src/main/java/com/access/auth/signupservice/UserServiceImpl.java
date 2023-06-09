package com.access.auth.signupservice;

import java.util.Calendar;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.access.auth.entities.PasswordResetToken;
import com.access.auth.entities.UserEntity;
import com.access.auth.entities.VerificationToken;
import com.access.auth.models.UserModel;
import com.access.auth.repositories.PasswordResetTokenRepo;
import com.access.auth.repositories.UserRepo;
import com.access.auth.repositories.VerificationTokenRepo;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private VerificationTokenRepo verficationTokenRepo;

	@Autowired
	private PasswordResetTokenRepo passwordResetTokenRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public UserEntity registerUser(UserModel userModel) {
		UserEntity user = new UserEntity();

		user.setUserName(userModel.getUserName());
		user.setEmail(userModel.getEmail());
		user.setPassword(passwordEncoder.encode(userModel.getPassword()));
		user.setRole("USER");
		user.setEnabled(true);

		userRepo.save(user);

		return user;
	}

	@Override
	public void saveVerificationTokenForUser(String token, UserEntity user) {
		VerificationToken verificationToken = new VerificationToken(user, token);

		verficationTokenRepo.save(verificationToken);
	}

	@Override
	public boolean validateVerificationToken(String token) {
		VerificationToken verificationToken = verficationTokenRepo.findByToken(token);

		if (verificationToken == null)
			return false;

		UserEntity user = verificationToken.getUser();
		Calendar cal = Calendar.getInstance();

		if (verificationToken.getExpirationTime().getTime() - cal.getTime().getTime() <= 0) {
			verficationTokenRepo.delete(verificationToken);
			return false;
		}

		user.setEnabled(true);
		userRepo.save(user);

		return true;
	}

	@Override
	public VerificationToken generateNewVerificationToken(String oldToken) {

		VerificationToken verificationToken = verficationTokenRepo.findByToken(oldToken);

		verificationToken.setToken(UUID.randomUUID().toString());
		verficationTokenRepo.save(verificationToken);

		return verificationToken;
	}

	@Override
	public UserEntity findByUserName(String userName) {
		return userRepo.findByUserName(userName);
	}

	@Override
	public void createPasswordResetTokenForUser(UserEntity user, String token) {
		PasswordResetToken passwordResetToken = new PasswordResetToken(user, token);
		passwordResetTokenRepo.save(passwordResetToken);

	}

	@Override
	public boolean validatePasswordResetToken(String token) {
		
		PasswordResetToken passwordResetToken = passwordResetTokenRepo.findByToken(token);

		if (passwordResetToken == null) {
			return false;
		}

		Calendar cal = Calendar.getInstance();


		if (passwordResetToken.getExpirationTime().getTime() - cal.getTime().getTime() <= 0) {
			log.info("Entered");
			passwordResetTokenRepo.delete(passwordResetToken);
			return false;
		}
		return true;
	}

	@Override
	public Optional<UserEntity> getUserByPasswordResetToken(String token) {

		return Optional.ofNullable(passwordResetTokenRepo.findByToken(token).getUser());
	}

	@Override
	public void changePassword(UserEntity user, String newPassword) {
		user.setPassword(passwordEncoder.encode(newPassword));
		userRepo.save(user);

	}

	@Override
	public boolean checkIfValidOldPassword(UserEntity user, String oldPassword) {
		return passwordEncoder.matches(oldPassword, user.getPassword());
	}

	@Override
	public String getTokenByUser(UserEntity user) {
		return verficationTokenRepo.findByUser(user).getToken();
	}

	@Override
	public boolean deleteUserByUsername(String username) {
		UserEntity user = userRepo.findByUserName(username);
		if(user != null) {
			userRepo.delete(user);
			return true;
		}
		return false;
	}
}
