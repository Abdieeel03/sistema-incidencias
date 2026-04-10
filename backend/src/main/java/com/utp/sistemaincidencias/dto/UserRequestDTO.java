package com.utp.sistemaincidencias.dto;

import com.utp.sistemaincidencias.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDTO {
	private String name;
	private String email;
	private String passwordHash;
	private UserRole role;
	private Boolean isActive;
}
