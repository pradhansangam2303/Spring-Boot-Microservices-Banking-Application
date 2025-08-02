package org.training.user.service.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.training.user.service.model.Status;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {

    private Long userId;
    private String emailId;
    private String contactNo;
    private String identificationNumber;
    private LocalDate creationOn;
    private Status status;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
}
