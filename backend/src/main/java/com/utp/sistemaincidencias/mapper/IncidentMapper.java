package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.IncidentRequestDTO;
import com.utp.sistemaincidencias.dto.IncidentResponseDTO;
import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.SchoolClass;
import com.utp.sistemaincidencias.model.Student;
import com.utp.sistemaincidencias.model.User;
import com.utp.sistemaincidencias.model.enums.IncidentStatus;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class IncidentMapper {

	public IncidentResponseDTO toResponseDTO(Incident incident) {
		if (incident == null) {
			return null;
		}

		return new IncidentResponseDTO(
				incident.getId(),
				incident.getTitle(),
				incident.getDescription(),
				incident.getStudent() != null ? incident.getStudent().getId() : null,
				incident.getSchoolClass() != null ? incident.getSchoolClass().getId() : null,
				incident.getReportedBy() != null ? incident.getReportedBy().getId() : null,
				incident.getStatus(),
				incident.getIncidentDate(),
				incident.getCreatedAt()
		);
	}

	public Incident toEntity(IncidentRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		if (dto.getStudentId() == null) {
			throw new IllegalArgumentException("StudentId is required!");
		}

		if (dto.getClassId() == null) {
			throw new IllegalArgumentException("ClassId is required!");
		}

		if (dto.getReportedById() == null) {
			throw new IllegalArgumentException("ReportedById is required!");
		}

		Incident incident = new Incident();
		incident.setTitle(dto.getTitle());
		incident.setDescription(dto.getDescription());
		incident.setStudent(toStudentReference(dto.getStudentId()));
		incident.setSchoolClass(toSchoolClassReference(dto.getClassId()));
		incident.setReportedBy(toUserReference(dto.getReportedById()));
		incident.setStatus(dto.getStatus() != null ? dto.getStatus() : IncidentStatus.abierta);
		incident.setIncidentDate(dto.getIncidentDate());
		return incident;
	}

	public void updateEntity(IncidentRequestDTO dto, Incident incident) {
		if (dto == null || incident == null) {
			return;
		}

		incident.setTitle(dto.getTitle());
		incident.setDescription(dto.getDescription());

		if (dto.getStatus() != null) {
			incident.setStatus(dto.getStatus());
		}

		incident.setIncidentDate(dto.getIncidentDate());

		if (dto.getStudentId() != null) {
			incident.setStudent(toStudentReference(dto.getStudentId()));
		}

		if (dto.getClassId() != null) {
			incident.setSchoolClass(toSchoolClassReference(dto.getClassId()));
		}

		if (dto.getReportedById() != null) {
			incident.setReportedBy(toUserReference(dto.getReportedById()));
		}
	}

	public List<IncidentResponseDTO> toResponseDTOList(List<Incident> incidents) {
		if (incidents == null) {
			return Collections.emptyList();
		}

		return incidents.stream()
				.filter(Objects::nonNull)
				.map(this::toResponseDTO)
				.toList();
	}

	private Student toStudentReference(Long id) {
		if (id == null) {
			return null;
		}

		Student student = new Student();
		student.setId(id);
		return student;
	}

	private SchoolClass toSchoolClassReference(Long id) {
		if (id == null) {
			return null;
		}

		SchoolClass schoolClass = new SchoolClass();
		schoolClass.setId(id);
		return schoolClass;
	}

	private User toUserReference(Long id) {
		if (id == null) {
			return null;
		}

		User user = new User();
		user.setId(id);
		return user;
	}
}
