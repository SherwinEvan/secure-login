# Secure Authentication System

## Overview
- Production-grade authentication application with route protection.
- Built with Spring Boot's Spring Security framework for enhanced security.
- Modern and intuitive frontend developed using ReactJS.
- Utilizes stateless session management for scalability and security.
- User data stored securely in an encrypted format within a MySQL database.
- Authorization implemented through randomly generated RSA key encrypted JSON Web Tokens (JWTs).
- JWTs securely stored in httpOnly cookies, preventing unauthorized access.
- Provides endpoints for user creation, account activation, login, password reset, logout, and account deletion.
- Efficient controller process flow for streamlined user management and authentication tasks.

## Getting Started
To set up the authentication system on your local machine for development and testing, follow these steps:

### Prerequisites
- Node.js and npm (Node Package Manager)
- Spring Tool Suite (or any Java IDE)
- MySQL

### Installation Steps
1. Fork a copy of the repository to your local machine.
2. Open the frontend directory in the terminal and execute the command `npm start` to start the frontend application.
3. Open the backend folder as a project in Spring Tool Suite (or your preferred Java IDE).
4. Modify the MySQL connection settings in the application.properties file to match your local MySQL configuration.
5. Right-click on the backend package and select "Run as Spring Boot App" to start the backend server.

## Code and Resources Used 
**Spring Boot Version:** 3.0.4   
**Dependencies:** Spring Security, Spring Starter JPA, OAuth2 Resource Server, Spring Starter Web, MySQL Connector J, Lombok, H2Database, JSON Web Token.
<br /> <br />
**ReactJS Version:** 18.0.2  
**Packages:** MaterialUI, Axios, Toastify and React Hook Form.

## Backend Implementation
The backend of the authentication system is built using Spring Boot's Spring Security framework. The codebase follows industry-standard practices and leverages various dependencies to achieve robustness and security.

### Controller Process Flow
The backend implementation consists of three controller classes, each responsible for a specific set of operations. These controllers work together to handle user management and authentication tasks. The process flow for each controller is as follows:

1. **SignUp Controller:**
   - The SignUpController provides endpoints for user registration and account activation.
   - When a new user signs up, an account is created in the database with the account activation status set to disabled.
   - After user creation, an event listener is triggered, generating a unique link with a random token.
   - The link is sent to the user's registered email address for account activation.
   - The token in the link is associated with the user account using a OneToOne mapping in the database tables.
   - If the user requests a resend of the verification link, the previous link is invalidated, and a new link is generated and sent.

2. **Login Controller:**
   - The LoginController handles user login and session initiation.
   - When a user successfully logs in, a JSON Web Token (JWT) is generated using a locally generated RSA key.
   - The JWT contains encrypted user information and serves as proof of authentication.
   - The generated JWT is assigned to an httpOnly cookie, which is sent to the client for storage.
   - Subsequent requests from the client include the encrypted cookie, allowing the server to validate the authenticity of the user.

3. **Logout Controller:**
   - The LogoutController provides endpoints for user logout and account deletion.
   - When a user logs out, the JWT is invalidated, and the httpOnly cookie is deleted from the client, ensuring secure session termination.
   - The controller also includes an endpoint for deleting user accounts, which requires proper authorization to prevent misuse.

## Frontend Implementation
The frontend of the authentication system is developed using ReactJS, a popular JavaScript library for building user interfaces. The frontend is designed with a focus on user experience and incorporates modern UI components and validation techniques.

- **Responsive Design:** The frontend is fully responsive and optimized for various devices, including mobile devices. This ensures a seamless user experience across different screen sizes and platforms.

- **MaterialUI Components:** The frontend utilizes MaterialUI components to achieve an aesthetically pleasing and intuitive user interface. These components enhance the visual appeal and usability of the authentication system.

- **Form Validation with React Hook Form:** Strict form validation is implemented using the React Hook Form library. This ensures that users provide accurate and valid information during registration, login, and password reset processes.

## Sample Images
![alt-text](https://github.com/SherwinEvan/secure-login/blob/1f732218635cf4ebece797d1b44b3dcc8b95234d/Images/login.png)
![alt-text](https://github.com/SherwinEvan/secure-login/blob/1f732218635cf4ebece797d1b44b3dcc8b95234d/Images/signup.png)
![alt-text](https://github.com/SherwinEvan/secure-login/blob/1f732218635cf4ebece797d1b44b3dcc8b95234d/Images/account.png)
