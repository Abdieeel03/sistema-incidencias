package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.IncidentReadReceiptRequestDTO;
import com.utp.sistemaincidencias.model.IncidentReadReceipt;
import java.util.List;
import java.util.Optional;

public interface IncidentReadReceiptService {
    List<IncidentReadReceipt> getAllReceipts();
    Optional<IncidentReadReceipt> getReceiptById(Long id);
    List<IncidentReadReceipt> getByIncidentId(Long incidentId);
    List<IncidentReadReceipt> getByParentId(Long parentId);
    IncidentReadReceipt createReceipt(IncidentReadReceiptRequestDTO dto);
    void deleteReceipt(Long id);
}
