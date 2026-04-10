package com.utp.sistemaincidencias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParentStudentResponseDTO {
	private Long id;
	private Long parentId;
	private Long studentId;
	private LocalDateTime createdAt;
}
