package org.training.user.service.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdate {

    @Email(message = "Email should be valid")
    private String emailId;

    private String contactNo;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
}
