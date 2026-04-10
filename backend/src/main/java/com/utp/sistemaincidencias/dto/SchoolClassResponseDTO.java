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
public class SchoolClassResponseDTO {
	private Long id;
	private String name;
	private String description;
	private Long teacherId;
	private Long sectionId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
