package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.IncidentReadReceiptRequestDTO;
import com.utp.sistemaincidencias.mapper.IncidentReadReceiptMapper;
import com.utp.sistemaincidencias.model.IncidentReadReceipt;
import com.utp.sistemaincidencias.repository.IncidentReadReceiptRepository;
import com.utp.sistemaincidencias.repository.IncidentRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import com.utp.sistemaincidencias.service.IncidentReadReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IncidentReadReceiptServiceImpl implements IncidentReadReceiptService {

    private final IncidentReadReceiptRepository receiptRepository;
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final IncidentReadReceiptMapper receiptMapper;

    @Override
    @Transactional(readOnly = true)
    public List<IncidentReadReceipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<IncidentReadReceipt> getReceiptById(Long id) {
        return receiptRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentReadReceipt> getByIncidentId(Long incidentId) {
        return receiptRepository.findByIncidentId(incidentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IncidentReadReceipt> getByParentId(Long parentId) {
        return receiptRepository.findByParentId(parentId);
    }

    @Override
    @Transactional
    public IncidentReadReceipt createReceipt(IncidentReadReceiptRequestDTO dto) {
        if (!incidentRepository.existsById(dto.getIncidentId())) {
            throw new RuntimeException("La incidencia con ID " + dto.getIncidentId() + " no existe");
        }
        if (!userRepository.existsById(dto.getParentId())) {
            throw new RuntimeException("El padre con ID " + dto.getParentId() + " no existe");
        }

        IncidentReadReceipt receipt = receiptMapper.toEntity(dto);
        return receiptRepository.save(receipt);
    }

    @Override
    @Transactional
    public void deleteReceipt(Long id) {
        receiptRepository.deleteById(id);
    }
}
