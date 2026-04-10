package com.utp.sistemaincidencias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDTO {
	private Long id;
	private String firstName;
	private String lastName;
	private LocalDate birthDate;
	private String studentCode;
	private Boolean isActive;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
