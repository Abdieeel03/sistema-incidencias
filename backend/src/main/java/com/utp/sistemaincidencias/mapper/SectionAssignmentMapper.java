package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.SectionAssignmentRequestDTO;
import com.utp.sistemaincidencias.dto.SectionAssignmentResponseDTO;
import com.utp.sistemaincidencias.model.SchoolClass;
import com.utp.sistemaincidencias.model.Section;
import com.utp.sistemaincidencias.model.SectionAssignment;
import com.utp.sistemaincidencias.model.Student;
import com.utp.sistemaincidencias.model.User;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class SectionAssignmentMapper {

	public SectionAssignmentResponseDTO toResponseDTO(SectionAssignment assignment) {
		if (assignment == null) {
			return null;
		}

		return new SectionAssignmentResponseDTO(
				assignment.getId(),
				assignment.getStudent() != null ? assignment.getStudent().getId() : null,
				assignment.getSection() != null ? assignment.getSection().getId() : null,
				assignment.getSchoolClass() != null ? assignment.getSchoolClass().getId() : null,
				assignment.getAssignedBy() != null ? assignment.getAssignedBy().getId() : null,
				assignment.getCreatedAt()
		);
	}

	public SectionAssignment toEntity(SectionAssignmentRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		if (dto.getSectionId() == null) {
			throw new IllegalArgumentException("SectionId is required");
		}

		if (dto.getStudentId() == null) {
			throw new IllegalArgumentException("StudentId is required");
		}

		if (dto.getClassId() == null) {
			throw new IllegalArgumentException("ClassId is required");
		}

		if (dto.getAssignedById() == null) {
			throw new IllegalArgumentException("AssignedId is required");
		}

		SectionAssignment assignment = new SectionAssignment();
		assignment.setStudent(toStudentReference(dto.getStudentId()));
		assignment.setSection(toSectionReference(dto.getSectionId()));
		assignment.setSchoolClass(toSchoolClassReference(dto.getClassId()));
		assignment.setAssignedBy(toUserReference(dto.getAssignedById()));
		return assignment;
	}

	public void updateEntity(SectionAssignmentRequestDTO dto, SectionAssignment assignment) {
		if (dto == null || assignment == null) {
			return;
		}

		if (dto.getSectionId() != null) {
			assignment.setSection(toSectionReference(dto.getSectionId()));
		}

		if (dto.getStudentId() != null) {
			assignment.setStudent(toStudentReference(dto.getStudentId()));
		}

		if (dto.getClassId() != null) {
			assignment.setSchoolClass(toSchoolClassReference(dto.getClassId()));
		}

		if (dto.getAssignedById() != null) {
			assignment.setAssignedBy(toUserReference(dto.getAssignedById()));
		}
	}

	public List<SectionAssignmentResponseDTO> toResponseDTOList(List<SectionAssignment> assignments) {
		if (assignments == null) {
			return Collections.emptyList();
		}

		return assignments.stream()
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

	private Section toSectionReference(Long id) {
		if (id == null) {
			return null;
		}

		Section section = new Section();
		section.setId(id);
		return section;
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
