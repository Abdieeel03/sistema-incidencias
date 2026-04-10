package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.StudentRequestDTO;
import com.utp.sistemaincidencias.dto.StudentResponseDTO;
import com.utp.sistemaincidencias.model.Student;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class StudentMapper {

	public StudentResponseDTO toResponseDTO(Student student) {
		if (student == null) {
			return null;
		}

		return new StudentResponseDTO(
				student.getId(),
				student.getFirstName(),
				student.getLastName(),
				student.getBirthDate(),
				student.getStudentCode(),
				student.getIsActive(),
				student.getCreatedAt(),
				student.getUpdatedAt()
		);
	}

	public Student toEntity(StudentRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		Student student = new Student();
		student.setFirstName(dto.getFirstName());
		student.setLastName(dto.getLastName());
		student.setBirthDate(dto.getBirthDate());
		student.setStudentCode(dto.getStudentCode());
		student.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
		return student;
	}

	public void updateEntity(StudentRequestDTO dto, Student student) {
		if (dto == null || student == null) {
			return;
		}

		student.setFirstName(dto.getFirstName());
		student.setLastName(dto.getLastName());
		student.setBirthDate(dto.getBirthDate());
		student.setStudentCode(dto.getStudentCode());
		if (dto.getIsActive() != null) {
			student.setIsActive(dto.getIsActive());
		}
	}

	public List<StudentResponseDTO> toResponseDTOList(List<Student> students) {
		if (students == null) {
			return Collections.emptyList();
		}

		return students.stream()
				.filter(Objects::nonNull)
				.map(this::toResponseDTO)
				.toList();
	}
}
