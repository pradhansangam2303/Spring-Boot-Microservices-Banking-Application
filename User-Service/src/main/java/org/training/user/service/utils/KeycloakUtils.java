package org.training.user.service.utils;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.training.user.service.model.dto.CreateUser;

import javax.annotation.PostConstruct;
import javax.ws.rs.core.Response;
import java.util.Collections;

@Component
@Slf4j
public class KeycloakUtils {

    @Value("${keycloak.auth-server-url:http://localhost:8571/}")
    private String keycloakUrl;

    @Value("${keycloak.realm:banking-service}")
    private String realm;

    @Value("${keycloak.resource:banking-service-client}")
    private String clientId;

    @Value("${keycloak.credentials.secret:your-client-secret}")
    private String clientSecret;

    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin.password:admin}")
    private String adminPassword;

    private Keycloak keycloak;

    @PostConstruct
    public void initKeycloak() {
        try {
            keycloak = KeycloakBuilder.builder()
                    .serverUrl(keycloakUrl)
                    .realm("master")
                    .username(adminUsername)
                    .password(adminPassword)
                    .clientId("admin-cli")
                    .build();
            log.info("Keycloak client initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize Keycloak client: ", e);
        }
    }

    public String createUserInKeycloak(CreateUser createUser) {
        try {
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            // Create user representation
            UserRepresentation userRepresentation = new UserRepresentation();
            userRepresentation.setUsername(createUser.getEmailId());
            userRepresentation.setEmail(createUser.getEmailId());
            userRepresentation.setFirstName(createUser.getFirstName());
            userRepresentation.setLastName(createUser.getLastName());
            userRepresentation.setEnabled(true);
            userRepresentation.setEmailVerified(true);

            // Create password credential
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(createUser.getPassword());
            credential.setTemporary(false);
            userRepresentation.setCredentials(Collections.singletonList(credential));

            // Create user
            Response response = usersResource.create(userRepresentation);
            
            if (response.getStatus() == 201) {
                String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
                log.info("User created in Keycloak with ID: {}", userId);
                return userId;
            } else {
                throw new RuntimeException("Failed to create user in Keycloak. Status: " + response.getStatus());
            }

        } catch (Exception e) {
            log.error("Error creating user in Keycloak: ", e);
            throw new RuntimeException("Failed to create user in Keycloak", e);
        }
    }
}