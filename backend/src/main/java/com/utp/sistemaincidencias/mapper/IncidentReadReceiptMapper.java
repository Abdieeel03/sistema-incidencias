package com.utp.sistemaincidencias.mapper;

import com.utp.sistemaincidencias.dto.IncidentReadReceiptRequestDTO;
import com.utp.sistemaincidencias.dto.IncidentReadReceiptResponseDTO;
import com.utp.sistemaincidencias.model.Incident;
import com.utp.sistemaincidencias.model.IncidentReadReceipt;
import com.utp.sistemaincidencias.model.User;

import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class IncidentReadReceiptMapper {

	public IncidentReadReceiptResponseDTO toResponseDTO(IncidentReadReceipt receipt) {
		if (receipt == null) {
			return null;
		}

		return new IncidentReadReceiptResponseDTO(
				receipt.getId(),
				receipt.getIncident() != null ? receipt.getIncident().getId() : null,
				receipt.getParent() != null ? receipt.getParent().getId() : null,
				receipt.getReadAt()
		);
	}

	public IncidentReadReceipt toEntity(IncidentReadReceiptRequestDTO dto) {
		if (dto == null) {
			return null;
		}

		IncidentReadReceipt receipt = new IncidentReadReceipt();
		receipt.setIncident(toIncidentReference(dto.getIncidentId()));
		receipt.setParent(toUserReference(dto.getParentId()));
		return receipt;
	}

	public void updateEntity(IncidentReadReceiptRequestDTO dto, IncidentReadReceipt receipt) {
		if (dto == null || receipt == null) {
			return;
		}

		receipt.setIncident(toIncidentReference(dto.getIncidentId()));
		receipt.setParent(toUserReference(dto.getParentId()));
	}

	public List<IncidentReadReceiptResponseDTO> toResponseDTOList(List<IncidentReadReceipt> receipts) {
		if (receipts == null) {
			return Collections.emptyList();
		}

		return receipts.stream()
				.filter(Objects::nonNull)
				.map(this::toResponseDTO)
				.toList();
	}

	private Incident toIncidentReference(Long id) {
		if (id == null) {
			return null;
		}

		Incident incident = new Incident();
		incident.setId(id);
		return incident;
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
