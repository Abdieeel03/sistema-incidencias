package com.utp.sistemaincidencias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SectionAssignmentRequestDTO {
	private Long studentId;
	private Long sectionId;
	private Long classId;
	private Long assignedById;
}
