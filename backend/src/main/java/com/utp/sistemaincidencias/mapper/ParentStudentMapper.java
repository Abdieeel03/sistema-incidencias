package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.ParentStudentRequestDTO;
import com.utp.sistemaincidencias.dto.ParentStudentResponseDTO;
import com.utp.sistemaincidencias.model.ParentStudent;
import com.utp.sistemaincidencias.model.Student;
import com.utp.sistemaincidencias.model.User;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Component
public class ParentStudentMapper {

	public ParentStudentResponseDTO toResponseDTO(ParentStudent parentStudent) {
		if (parentStudent == null) {
			return null;
		}

		return new ParentStudentResponseDTO(
				parentStudent.getId(),
				parentStudent.getParent() != null ? parentStudent.getParent().getId() : null,
				parentStudent.getStudent() != null ? parentStudent.getStudent().getId() : null,
				parentStudent.getCreatedAt()
		);
	}

	public ParentStudent toEntity(ParentStudentRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		if (dto.getParentId() == null) {
			throw new IllegalArgumentException("ParentStudentId is required");
		}

		if (dto.getStudentId() == null) {
			throw new IllegalArgumentException("StudentId is required");
		}

		ParentStudent parentStudent = new ParentStudent();
		parentStudent.setParent(toUserReference(dto.getParentId()));
		parentStudent.setStudent(toStudentReference(dto.getStudentId()));
		return parentStudent;
	}

	public void updateEntity(ParentStudentRequestDTO dto, ParentStudent parentStudent) {
		if (dto == null || parentStudent == null) {
			return;
		}

		if (dto.getParentId() != null) {
			parentStudent.setParent(toUserReference(dto.getParentId()));
		}

		if (dto.getStudentId() != null) {
			parentStudent.setStudent(toStudentReference(dto.getStudentId()));
		}
	}

	public List<ParentStudentResponseDTO> toResponseDTOList(List<ParentStudent> parentStudents) {
		if (parentStudents == null) {
			return Collections.emptyList();
		}

		return parentStudents.stream()
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

	private Student toStudentReference(Long id) {
		if (id == null) {
			return null;
		}

		Student student = new Student();
		student.setId(id);
		return student;
	}
}
