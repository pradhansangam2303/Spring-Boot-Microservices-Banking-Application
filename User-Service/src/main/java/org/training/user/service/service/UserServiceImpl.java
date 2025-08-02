package org.training.user.service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.training.user.service.exception.UserNotFoundException;
import org.training.user.service.model.Status;
import org.training.user.service.model.dto.CreateUser;
import org.training.user.service.model.dto.UserDto;
import org.training.user.service.model.dto.UserUpdate;
import org.training.user.service.model.dto.UserUpdateStatus;
import org.training.user.service.model.dto.response.Response;
import org.training.user.service.model.entity.User;
import org.training.user.service.model.entity.UserProfile;
import org.training.user.service.repository.UserRepository;
import org.training.user.service.utils.KeycloakUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final KeycloakUtils keycloakUtils;

    @Override
    public Response createUser(CreateUser createUser) {
        try {
            // Check if user already exists
            if (userRepository.findByEmailId(createUser.getEmailId()).isPresent()) {
                return Response.builder()
                        .responseMessage("User with email already exists")
                        .success(false)
                        .build();
            }

            if (userRepository.findByIdentificationNumber(createUser.getIdentificationNumber()).isPresent()) {
                return Response.builder()
                        .responseMessage("User with identification number already exists")
                        .success(false)
                        .build();
            }

            // Create user in Keycloak
            String authId = keycloakUtils.createUserInKeycloak(createUser);

            // Create user profile
            UserProfile userProfile = UserProfile.builder()
                    .firstName(createUser.getFirstName())
                    .lastName(createUser.getLastName())
                    .dateOfBirth(createUser.getDateOfBirth())
                    .address(createUser.getAddress())
                    .city(createUser.getCity())
                    .state(createUser.getState())
                    .country(createUser.getCountry())
                    .postalCode(createUser.getPostalCode())
                    .build();

            // Create user
            User user = User.builder()
                    .emailId(createUser.getEmailId())
                    .contactNo(createUser.getContactNo())
                    .identificationNumber(createUser.getIdentificationNumber())
                    .authId(authId)
                    .status(Status.ACTIVE)
                    .userProfile(userProfile)
                    .build();

            User savedUser = userRepository.save(user);

            return Response.builder()
                    .responseMessage("User created successfully")
                    .data(convertToDto(savedUser))
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error creating user: ", e);
            return Response.builder()
                    .responseMessage("Failed to create user: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> readAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto readUser(String authId) {
        User user = userRepository.findByAuthId(authId)
                .orElseThrow(() -> new UserNotFoundException("User not found with authId: " + authId));
        return convertToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto readUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
        return convertToDto(user);
    }

    @Override
    public Response updateUserStatus(Long userId, UserUpdateStatus userUpdateStatus) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

            user.setStatus(userUpdateStatus.getStatus());
            User updatedUser = userRepository.save(user);

            return Response.builder()
                    .responseMessage("User status updated successfully")
                    .data(convertToDto(updatedUser))
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error updating user status: ", e);
            return Response.builder()
                    .responseMessage("Failed to update user status: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    public Response updateUser(Long userId, UserUpdate userUpdate) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

            // Update user basic info
            if (userUpdate.getEmailId() != null) {
                user.setEmailId(userUpdate.getEmailId());
            }
            if (userUpdate.getContactNo() != null) {
                user.setContactNo(userUpdate.getContactNo());
            }

            // Update user profile
            UserProfile userProfile = user.getUserProfile();
            if (userUpdate.getFirstName() != null) {
                userProfile.setFirstName(userUpdate.getFirstName());
            }
            if (userUpdate.getLastName() != null) {
                userProfile.setLastName(userUpdate.getLastName());
            }
            if (userUpdate.getDateOfBirth() != null) {
                userProfile.setDateOfBirth(userUpdate.getDateOfBirth());
            }
            if (userUpdate.getAddress() != null) {
                userProfile.setAddress(userUpdate.getAddress());
            }
            if (userUpdate.getCity() != null) {
                userProfile.setCity(userUpdate.getCity());
            }
            if (userUpdate.getState() != null) {
                userProfile.setState(userUpdate.getState());
            }
            if (userUpdate.getCountry() != null) {
                userProfile.setCountry(userUpdate.getCountry());
            }
            if (userUpdate.getPostalCode() != null) {
                userProfile.setPostalCode(userUpdate.getPostalCode());
            }

            User updatedUser = userRepository.save(user);

            return Response.builder()
                    .responseMessage("User updated successfully")
                    .data(convertToDto(updatedUser))
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Error updating user: ", e);
            return Response.builder()
                    .responseMessage("Failed to update user: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto readUserByAccountId(String accountId) {
        // This would typically involve calling the Account Service to get user ID
        // For now, throwing an exception as implementation depends on Account Service
        throw new UnsupportedOperationException("This method requires Account Service integration");
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = modelMapper.map(user, UserDto.class);
        if (user.getUserProfile() != null) {
            userDto.setFirstName(user.getUserProfile().getFirstName());
            userDto.setLastName(user.getUserProfile().getLastName());
            userDto.setDateOfBirth(user.getUserProfile().getDateOfBirth());
            userDto.setAddress(user.getUserProfile().getAddress());
            userDto.setCity(user.getUserProfile().getCity());
            userDto.setState(user.getUserProfile().getState());
            userDto.setCountry(user.getUserProfile().getCountry());
            userDto.setPostalCode(user.getUserProfile().getPostalCode());
        }
        return userDto;
    }
}