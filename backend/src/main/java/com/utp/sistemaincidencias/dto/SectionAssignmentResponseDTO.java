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
public class SectionAssignmentResponseDTO {
	private Long id;
	private Long studentId;
	private Long sectionId;
	private Long classId;
	private Long assignedById;
	private LocalDateTime createdAt;
}
