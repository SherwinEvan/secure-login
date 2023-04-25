package com.access.auth.models;

import lombok.Data;

@Data
public class PasswordModel {
	
	private String email;
	
	private String oldPassword;
	
	private String newPassword;
	
	private String oldToken;
}