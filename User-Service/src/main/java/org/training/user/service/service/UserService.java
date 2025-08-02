package org.training.user.service.service;

import org.training.user.service.model.dto.CreateUser;
import org.training.user.service.model.dto.UserDto;
import org.training.user.service.model.dto.UserUpdate;
import org.training.user.service.model.dto.UserUpdateStatus;
import org.training.user.service.model.dto.response.Response;

import java.util.List;

public interface UserService {

    Response createUser(CreateUser createUser);

    List<UserDto> readAllUsers();

    UserDto readUser(String authId);

    UserDto readUserById(Long userId);

    Response updateUserStatus(Long userId, UserUpdateStatus userUpdateStatus);

    Response updateUser(Long userId, UserUpdate userUpdate);

    UserDto readUserByAccountId(String accountId);
}
