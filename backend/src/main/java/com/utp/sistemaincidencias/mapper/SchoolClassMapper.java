package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.SchoolClassRequestDTO;
import com.utp.sistemaincidencias.dto.SchoolClassResponseDTO;
import com.utp.sistemaincidencias.model.SchoolClass;
import com.utp.sistemaincidencias.model.Section;
import com.utp.sistemaincidencias.model.User;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class SchoolClassMapper {

	public SchoolClassResponseDTO toResponseDTO(SchoolClass schoolClass) {
		if (schoolClass == null) {
			return null;
		}

		return new SchoolClassResponseDTO(
				schoolClass.getId(),
				schoolClass.getName(),
				schoolClass.getDescription(),
				schoolClass.getTeacher() != null ? schoolClass.getTeacher().getId() : null,
				schoolClass.getSection() != null ? schoolClass.getSection().getId() : null,
				schoolClass.getCreatedAt(),
				schoolClass.getUpdatedAt()
		);
	}

	public SchoolClass toEntity(SchoolClassRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		if (dto.getTeacherId() == null) {
			throw new IllegalArgumentException("TeacherId is required");
		}

		if (dto.getSectionId() == null) {
			throw new IllegalArgumentException("SectionId is required");
		}

		SchoolClass schoolClass = new SchoolClass();
		schoolClass.setName(dto.getName());
		schoolClass.setDescription(dto.getDescription());
		schoolClass.setTeacher(toUserReference(dto.getTeacherId()));
		schoolClass.setSection(toSectionReference(dto.getSectionId()));
		return schoolClass;
	}

	public void updateEntity(SchoolClassRequestDTO dto, SchoolClass schoolClass) {
		if (dto == null || schoolClass == null) {
			return;
		}

		schoolClass.setName(dto.getName());
		schoolClass.setDescription(dto.getDescription());

		if (dto.getTeacherId() != null) {
			schoolClass.setTeacher(toUserReference(dto.getTeacherId()));
		}
		if (dto.getSectionId() != null) {
			schoolClass.setSection(toSectionReference(dto.getSectionId()));
		}
	}

	public List<SchoolClassResponseDTO> toResponseDTOList(List<SchoolClass> classes) {
		if (classes == null) {
			return Collections.emptyList();
		}

		return classes.stream()
				.filter(Objects::nonNull)
				.map(this::toResponseDTO)
				.toList();
	}

	private User toUserReference(Long id) {
		if (id == null) {
			return null;
		}

		User user = new User();
		user.setId(id);
		return user;
	}

	private Section toSectionReference(Long id) {
		if (id == null) {
			return null;
		}

		Section section = new Section();
		section.setId(id);
		return section;
	}
}
