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
public class IncidentReadReceiptResponseDTO {
	private Long id;
	private Long incidentId;
	private Long parentId;
	private LocalDateTime readAt;
}
