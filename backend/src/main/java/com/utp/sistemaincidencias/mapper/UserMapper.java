package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.UserRequestDTO;
import com.utp.sistemaincidencias.dto.UserResponseDTO;
import com.utp.sistemaincidencias.model.User;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class UserMapper {

	public UserResponseDTO toResponseDTO(User user) {
		if (user == null) {
			return null;
		}

		return new UserResponseDTO(
				user.getId(),
				user.getName(),
				user.getEmail(),
				user.getRole(),
				user.getIsActive(),
				user.getCreatedAt(),
				user.getUpdatedAt()
		);
	}

	public User toEntity(UserRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		User user = new User();
		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setRole(dto.getRole());
		user.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
		return user;
	}

	public void updateEntity(UserRequestDTO dto, User user) {
		if (dto == null || user == null) {
			return;
		}

		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setRole(dto.getRole());

		if (dto.getIsActive() != null) {
			user.setIsActive(dto.getIsActive());
		}
	}

	public List<UserResponseDTO> toResponseDTOList(List<User> users) {
		if (users == null) {
			return Collections.emptyList();
		}

		return users.stream()
				.filter(Objects::nonNull)
				.map(this::toResponseDTO)
				.toList();
	}
}
