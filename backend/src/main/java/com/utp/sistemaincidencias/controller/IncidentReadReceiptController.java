package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.IncidentReadReceiptRequestDTO;
import com.utp.sistemaincidencias.dto.IncidentReadReceiptResponseDTO;
import com.utp.sistemaincidencias.mapper.IncidentReadReceiptMapper;
import com.utp.sistemaincidencias.service.IncidentReadReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incident-receipts")
@RequiredArgsConstructor
public class IncidentReadReceiptController {

    private final IncidentReadReceiptService receiptService;
    private final IncidentReadReceiptMapper receiptMapper;

    @GetMapping
    public ResponseEntity<List<IncidentReadReceiptResponseDTO>> getAllReceipts() {
        List<IncidentReadReceiptResponseDTO> receipts = receiptMapper.toResponseDTOList(
                receiptService.getAllReceipts());
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentReadReceiptResponseDTO> getReceiptById(@PathVariable Long id) {
        return receiptService.getReceiptById(id)
                .map(receipt -> ResponseEntity.ok(receiptMapper.toResponseDTO(receipt)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/incident/{incidentId}")
    public ResponseEntity<List<IncidentReadReceiptResponseDTO>> getByIncidentId(@PathVariable Long incidentId) {
        List<IncidentReadReceiptResponseDTO> receipts = receiptMapper.toResponseDTOList(
                receiptService.getByIncidentId(incidentId));
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<IncidentReadReceiptResponseDTO>> getByParentId(@PathVariable Long parentId) {
        List<IncidentReadReceiptResponseDTO> receipts = receiptMapper.toResponseDTOList(
                receiptService.getByParentId(parentId));
        return ResponseEntity.ok(receipts);
    }

    @PostMapping
    public ResponseEntity<IncidentReadReceiptResponseDTO> createReceipt(@RequestBody IncidentReadReceiptRequestDTO dto) {
        IncidentReadReceiptResponseDTO response = receiptMapper.toResponseDTO(receiptService.createReceipt(dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
        return ResponseEntity.noContent().build();
    }
}
