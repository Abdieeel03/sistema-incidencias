package com.utp.sistemaincidencias.dto;

import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequestDTO {
	private String title;
	private String description;
	private Long studentId;
	private Long classId;
	private Long reportedById;
	private IncidentStatus status;
	private LocalDateTime incidentDate;
}
