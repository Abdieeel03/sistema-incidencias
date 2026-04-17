package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.IncidentReadReceiptRequestDTO;
import com.utp.sistemaincidencias.dto.IncidentReadReceiptResponseDTO;
import com.utp.sistemaincidencias.mapper.IncidentReadReceiptMapper;
import com.utp.sistemaincidencias.model.IncidentReadReceipt;
import com.utp.sistemaincidencias.service.IncidentReadReceiptService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentReadReceiptControllerTest {

    @Mock
    private IncidentReadReceiptService receiptService;

    @Mock
    private IncidentReadReceiptMapper receiptMapper;

    @InjectMocks
    private IncidentReadReceiptController receiptController;

    private IncidentReadReceipt createReceipt(Long id) {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        receipt.setId(id);
        return receipt;
    }

    private IncidentReadReceiptResponseDTO createResponseDTO(Long id) {
        LocalDateTime now = LocalDateTime.now();
        return new IncidentReadReceiptResponseDTO(id, 1L, 2L, now);
    }

    @Test
    void testGetAllReceipts() {
        IncidentReadReceipt r1 = createReceipt(1L);
        IncidentReadReceipt r2 = createReceipt(2L);
        IncidentReadReceiptResponseDTO dto1 = createResponseDTO(1L);
        IncidentReadReceiptResponseDTO dto2 = createResponseDTO(2L);

        when(receiptService.getAllReceipts()).thenReturn(Arrays.asList(r1, r2));
        when(receiptMapper.toResponseDTOList(Arrays.asList(r1, r2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<IncidentReadReceiptResponseDTO>> response =
                receiptController.getAllReceipts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetReceiptByIdFound() {
        IncidentReadReceipt receipt = createReceipt(1L);
        IncidentReadReceiptResponseDTO dto = createResponseDTO(1L);

        when(receiptService.getReceiptById(1L)).thenReturn(Optional.of(receipt));
        when(receiptMapper.toResponseDTO(receipt)).thenReturn(dto);

        ResponseEntity<IncidentReadReceiptResponseDTO> response =
                receiptController.getReceiptById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testGetReceiptByIdNotFound() {
        when(receiptService.getReceiptById(99L)).thenReturn(Optional.empty());

        ResponseEntity<IncidentReadReceiptResponseDTO> response =
                receiptController.getReceiptById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testGetByIncidentId() {
        IncidentReadReceipt receipt = createReceipt(1L);
        IncidentReadReceiptResponseDTO dto = createResponseDTO(1L);

        when(receiptService.getByIncidentId(5L)).thenReturn(List.of(receipt));
        when(receiptMapper.toResponseDTOList(List.of(receipt))).thenReturn(List.of(dto));

        ResponseEntity<List<IncidentReadReceiptResponseDTO>> response =
                receiptController.getByIncidentId(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetByParentId() {
        IncidentReadReceipt receipt = createReceipt(1L);
        IncidentReadReceiptResponseDTO dto = createResponseDTO(1L);

        when(receiptService.getByParentId(3L)).thenReturn(List.of(receipt));
        when(receiptMapper.toResponseDTOList(List.of(receipt))).thenReturn(List.of(dto));

        ResponseEntity<List<IncidentReadReceiptResponseDTO>> response =
                receiptController.getByParentId(3L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testCreateReceipt() {
        IncidentReadReceiptRequestDTO requestDTO = new IncidentReadReceiptRequestDTO(1L, 2L);
        IncidentReadReceipt created = createReceipt(1L);
        IncidentReadReceiptResponseDTO responseDTO = createResponseDTO(1L);

        when(receiptService.createReceipt(requestDTO)).thenReturn(created);
        when(receiptMapper.toResponseDTO(created)).thenReturn(responseDTO);

        ResponseEntity<IncidentReadReceiptResponseDTO> response =
                receiptController.createReceipt(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testDeleteReceipt() {
        doNothing().when(receiptService).deleteReceipt(1L);

        ResponseEntity<Void> response = receiptController.deleteReceipt(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(receiptService, times(1)).deleteReceipt(1L);
    }
}
