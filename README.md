# Secure Authentication 
* Created an production grade, robust authentication application that allows for route protection.
* Built with Spring Boot's Spring Security. 
* This system design follows the use of stateless session management with loosly coupled service classes where data is stored in encrypted form in the MySQL database.
* Authorization is achived through randomly generated RSA key encrypted JWTs.
* Generated JWTs is stored in httpOnly cookies, whih can only be accessed and manipulated by the server.
* Endpoints to create a new user, activate user, login, password reset, logout and delete user are defined.
* Built a frontend client using ReactJS.

## Code and Resources Used 
**Spring Boot Version:** 3.0.4   
**Dependencies:** Spring Security, Spring Starter JPA, OAuth2 Resource Server, Spring Starter Web, MySQL Connector J, Lombok, H2Database, JSON Web Token.
<br /> <br />
**ReactJS Version:** 18.0.2  
**Packages:** MaterialUI, Axios, Toastify and React Hook Form.


## Controller process flow
There are 3 controller classes, each with their own purpose of handling SignUp, Login, and Logout.  
* SignUp controller
   * Has an endpoint to add a user account in the database with the account activation status as disabled.
   * Creating a new user will trigger a event listener that generates a link with a random token which is valid only for a limited time and single use that has to be clicked to activate the account.
   * Has an endpoint that resends the verification link on request and when done so, makes the older link invalid. This is actived to OneToOne mapping in the database tables.
   * Has an endpoint that allows for password reset through a randomly generated link and another to change the password with an already logged in account.
<br/>

* Login controller
   * Has an endpoint login a user and get current security context.
   * Logging user generates a JWT encrypted using a locally generated RSA key.
   * The generated JWT is assigned to a locally created httpOnly cookie and this cookie is sent to be stored in the client. 
   * Further requests are sent along with this httpOnly cookie and this cookie is unpacked by the server and the JWT is decrypted to checck for it's validity.
<br/>

* Logout controller
   * Has an endpoint to logout a user.
   * A logout request invalidates the JWT and the httpOnly cookie is deleted from the client.
   * Also has an endpoint to delete an user, where an user account can be deleted by themselves if there is proper authorization.

## Frontend 
* Build the required frontend for the API defined.
* Made with ReactJS and used MaterialUI components to achieve styling.
* Messages/Replies from the server is displayed as toast messages.
* Strict form validation is done with the help of react-hook-form to ensure no misinput is allowed to be sent as an request.
* Full responsive on mobile devices aswell.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build and run the app 
- Package Manager (Node + Npm)
- Spring Tool Suite
- MySQL

### Installing

* Fork a copy of the repository to your machine.
* Open frontend directory in the terminal.
* Execute the following command.

    `npm start`

* Open the backend folder as a project in Spring Tool Suite.
* Change the MySQL user name, password and database to match the one in your machine's, in the application.properties file.
* Right click on the package and select Run as Spring Boot App.
