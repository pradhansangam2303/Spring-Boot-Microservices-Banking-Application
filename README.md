# 🌟 Spring Boot Microservices Banking Application 🌟

## 📋 Table of Contents

- [🔍 About](#-about)
- [🏛️ Architecture](#-architecture)
- [🚀 Microservices](#-microservices)
- [🛠️ Technology Stack](#-technology-stack)
- [🚀 Getting Started](#-getting-started)
- [🐳 Docker Setup](#-docker-setup)
- [📖 API Documentation](#-api-documentation)
- [🔒 Security](#-security)
- [⌚ Future Enhancement](#-future-enhancement)
- [🤝 Contribution](#-contribution)
- [📞 Contact Information](#-contact-information)

## 🔍 About

The Banking Application is built using a microservices architecture, incorporating the Spring Boot framework along with other Spring technologies such as Spring Data JPA, Spring Cloud, and Spring Security, alongside tools like Maven for dependency management. These technologies play a crucial role in establishing essential components like Service Registry, API Gateway, and more.

Moreover, they enable us to develop independent microservices such as the user service for user management, the account service for account generation and other related functionalities, the fund transfer service for various transfer operations, and the transaction service for viewing transactions and facilitating withdrawals and deposits. These technologies not only streamline development but also enhance scalability and maintainability, ensuring a robust and efficient banking system.

## 🏛️ Architecture

- **Service Registry:** The microservices uses the discovery service for service registration and service discovery, this helps the microservices to discovery and communicate with other services, without needing to hardcode the endpoints while communicating with other microservices.

- **API Gateway:** This microservices uses the API gateway to centralize the API endpoint, where all the endpoints have common entry point to all the endpoints. The API Gateway also facilitates the Security inclusion where the Authorization and Authentication for the Application.

- **Database per Microservice:** Each of the microservice have there own dedicated database. Here for this application for all the microservices we are incorporating the MySQL database. This helps us to isolate each of the services from each other which facilitates each services to have their own data schemas and scale each of the database when required.

## 🚀 Microservices

- **👤 User Service (Port: 8081):** The user microservice provides functionalities for user management. This includes user registration, updating user details, viewing user information, and accessing all accounts associated with the user. Additionally, this microservice handles user authentication and authorization processes with Keycloak integration.

- **💼 Account Service (Port: 8082):** The account microservice manages account-related APIs. It enables users to modify account details, view all accounts linked to the user profile, access transaction histories for each account, and supports the account closure process.

- **💸 Fund Transfer Service (Port: 8084):** The fund transfer microservice facilitates various fund transfer-related functionalities. Users can initiate fund transfers between different accounts, access detailed fund transfer records, and view specific details of any fund transfer transaction.

- **💳 Transaction Service (Port: 8085):** The transaction service offers a range of transaction-related services. Users can view transactions based on specific accounts or transaction reference IDs, as well as make deposits or withdrawals from their accounts.

- **🔢 Sequence Generator (Port: 8083):** Generates unique account numbers and transaction reference IDs to ensure data integrity across the system.

- **🌐 API Gateway (Port: 8080):** Centralized entry point for all client requests with OAuth2 security integration.

- **📋 Service Registry (Port: 8761):** Eureka server for service discovery and registration.

## 🛠️ Technology Stack

- **Framework:** Spring Boot 2.7.14
- **Cloud:** Spring Cloud 2021.0.8
- **Security:** Spring Security + OAuth2 + Keycloak
- **Database:** MySQL 8.0 (per service)
- **Service Discovery:** Netflix Eureka
- **API Gateway:** Spring Cloud Gateway
- **Communication:** OpenFeign, REST APIs
- **Build Tool:** Maven
- **Java Version:** 17
- **Containerization:** Docker & Docker Compose
- **Object Mapping:** ModelMapper
- **Validation:** Spring Boot Validation

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- MySQL 8.0 (if running locally)

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Spring-Boot-Microservices-Banking-Application
   ```

2. **Start the databases:**
   ```bash
   # Start MySQL databases
   docker-compose up -d user-service-db account-service-db transaction-service-db fund-transfer-service-db sequence-generator-db keycloak-db
   ```

3. **Start Keycloak:**
   ```bash
   docker-compose up -d keycloak
   ```

4. **Build all services:**
   ```bash
   # Build each service
   cd Service-Registry && mvn clean package -DskipTests && cd ..
   cd API-Gateway && mvn clean package -DskipTests && cd ..
   cd User-Service && mvn clean package -DskipTests && cd ..
   cd Sequence-Generator && mvn clean package -DskipTests && cd ..
   ```

5. **Run services in order:**
   ```bash
   # 1. Start Service Registry
   cd Service-Registry && mvn spring-boot:run &
   
   # 2. Wait for Service Registry to start, then start other services
   cd User-Service && mvn spring-boot:run &
   cd Sequence-Generator && mvn spring-boot:run &
   cd API-Gateway && mvn spring-boot:run &
   ```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f [service-name]
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Service URLs

- **Service Registry:** http://localhost:8761
- **API Gateway:** http://localhost:8080
- **User Service:** http://localhost:8081
- **Sequence Generator:** http://localhost:8083
- **Keycloak:** http://localhost:8571

## 📖 API Documentation

### User Service APIs

- `POST /api/users/register` - Register new user
- `GET /api/users` - Get all users
- `GET /api/users/{userId}` - Get user by ID
- `GET /api/users/auth/{authId}` - Get user by auth ID
- `PUT /api/users/{id}` - Update user
- `PATCH /api/users/{id}` - Update user status

### Sequence Generator APIs

- `POST /sequence` - Generate new account number

### API Gateway Routes

All requests should go through the API Gateway at `http://localhost:8080`:

- User Service: `/api/users/**`
- Account Service: `/accounts/**`
- Transaction Service: `/transactions/**`
- Fund Transfer Service: `/fund-transfers/**`
- Sequence Generator: `/sequence/**`

## 🔒 Security

### Keycloak Configuration

1. **Access Keycloak Admin Console:**
   - URL: http://localhost:8571
   - Username: admin
   - Password: admin

2. **Create Realm:**
   - Create a new realm named `banking-service`

3. **Create Client:**
   - Client ID: `banking-app`
   - Configure redirect URIs and client settings

4. **User Management:**
   - Users are automatically created in Keycloak during registration
   - JWT tokens are used for authentication

### Security Features

- OAuth2/JWT authentication
- Public access to user registration
- Protected endpoints for all other operations
- CORS configuration for web clients

## ⌚ Future Enhancement

As part of our ongoing commitment to improving the banking application, we are planning several enhancements to enrich user experience and expand functionality:

- Implementing a robust notification system will keep users informed about important account activities, such as transaction updates, account statements, and security alerts. Integration with email and SMS will ensure timely and relevant communication.
- Adding deposit and investment functionalities will enable users to manage their savings and investments directly through the banking application. Features such as fixed deposits, recurring deposits, and investment portfolio tracking will empower users to make informed financial decisions.
- Complete implementation of Account Service, Transaction Service, and Fund Transfer Service
- API rate limiting and throttling
- Comprehensive monitoring and logging with ELK stack
- Unit and integration tests
- CI/CD pipeline setup

## 🤝 Contribution

Contributions to this project are welcome! Feel free to open issues, submit pull requests, or provide feedback to enhance the functionality and usability of this banking application. Follow the basic PR specification while creating a PR.

### Development Guidelines

1. Follow Spring Boot best practices
2. Write comprehensive tests
3. Update documentation for new features
4. Use conventional commit messages
5. Ensure code quality with SonarQube

Let's build a robust and efficient banking system together using Spring Boot microservices!

Happy Banking! 🏦💰

## 📞 Contact Information

If you have any questions, feedback, or need assistance with this project, please feel free to reach out to me:

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/6361921186)
[![GMAIL](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kartikkulkarni1411@gmail.com)

We appreciate your interest in our project and look forward to hearing from you. Happy coding!