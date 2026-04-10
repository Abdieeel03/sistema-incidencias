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
public class SectionResponseDTO {
	private Long id;
	private String name;
	private String grade;
	private Short capacity;
	private Long coordinatorId;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
