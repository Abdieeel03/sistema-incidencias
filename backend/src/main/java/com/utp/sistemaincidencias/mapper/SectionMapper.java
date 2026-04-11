package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.SectionRequestDTO;
import com.utp.sistemaincidencias.dto.SectionResponseDTO;
import com.utp.sistemaincidencias.model.Section;
import com.utp.sistemaincidencias.model.User;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Component
public class SectionMapper {

	public SectionResponseDTO toResponseDTO(Section section) {
		if (section == null) {
			return null;
		}

		return new SectionResponseDTO(
				section.getId(),
				section.getName(),
				section.getGrade(),
				section.getCapacity(),
				section.getCoordinator() != null ? section.getCoordinator().getId() : null,
				section.getCreatedAt(),
				section.getUpdatedAt()
		);
	}

	public Section toEntity(SectionRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		if (dto.getCoordinatorId() == null) {
			throw new IllegalArgumentException("CoordinatorId is required");
		}

		Section section = new Section();
		section.setName(dto.getName());
		section.setGrade(dto.getGrade());
		section.setCapacity(dto.getCapacity());
		section.setCoordinator(toUserReference(dto.getCoordinatorId()));
		return section;
	}

	public void updateEntity(SectionRequestDTO dto, Section section) {
		if (dto == null || section == null) {
			return;
		}

		section.setName(dto.getName());
		section.setGrade(dto.getGrade());
		section.setCapacity(dto.getCapacity());

		if (dto.getCoordinatorId() != null) {
			section.setCoordinator(toUserReference(dto.getCoordinatorId()));
		}
	}

	public List<SectionResponseDTO> toResponseDTOList(List<Section> sections) {
		if (sections == null) {
			return Collections.emptyList();
		}

		return sections.stream()
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
}
