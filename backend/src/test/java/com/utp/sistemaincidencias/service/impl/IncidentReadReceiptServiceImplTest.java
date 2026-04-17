package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.IncidentReadReceiptRequestDTO;
import com.utp.sistemaincidencias.mapper.IncidentReadReceiptMapper;
import com.utp.sistemaincidencias.model.IncidentReadReceipt;
import com.utp.sistemaincidencias.repository.IncidentReadReceiptRepository;
import com.utp.sistemaincidencias.repository.IncidentRepository;
import com.utp.sistemaincidencias.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentReadReceiptServiceImplTest {

    @Mock
    private IncidentReadReceiptRepository receiptRepository;

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private IncidentReadReceiptMapper receiptMapper;

    @InjectMocks
    private IncidentReadReceiptServiceImpl receiptService;

    @Test
    void testGetAllReceipts() {
        IncidentReadReceipt r1 = new IncidentReadReceipt();
        r1.setId(1L);
        IncidentReadReceipt r2 = new IncidentReadReceipt();
        r2.setId(2L);

        when(receiptRepository.findAll()).thenReturn(Arrays.asList(r1, r2));

        List<IncidentReadReceipt> result = receiptService.getAllReceipts();

        assertEquals(2, result.size());
        verify(receiptRepository, times(1)).findAll();
    }

    @Test
    void testGetReceiptByIdFound() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        receipt.setId(1L);

        when(receiptRepository.findById(1L)).thenReturn(Optional.of(receipt));

        Optional<IncidentReadReceipt> result = receiptService.getReceiptById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testGetReceiptByIdNotFound() {
        when(receiptRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<IncidentReadReceipt> result = receiptService.getReceiptById(99L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetByIncidentId() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        receipt.setId(1L);

        when(receiptRepository.findByIncidentId(5L)).thenReturn(List.of(receipt));

        List<IncidentReadReceipt> result = receiptService.getByIncidentId(5L);

        assertEquals(1, result.size());
    }

    @Test
    void testGetByParentId() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        receipt.setId(1L);

        when(receiptRepository.findByParentId(3L)).thenReturn(List.of(receipt));

        List<IncidentReadReceipt> result = receiptService.getByParentId(3L);

        assertEquals(1, result.size());
    }

    @Test
    void testCreateReceiptSuccess() {
        IncidentReadReceiptRequestDTO dto = new IncidentReadReceiptRequestDTO(1L, 2L);
        IncidentReadReceipt mappedReceipt = new IncidentReadReceipt();
        IncidentReadReceipt savedReceipt = new IncidentReadReceipt();
        savedReceipt.setId(1L);

        when(incidentRepository.existsById(1L)).thenReturn(true);
        when(userRepository.existsById(2L)).thenReturn(true);
        when(receiptMapper.toEntity(dto)).thenReturn(mappedReceipt);
        when(receiptRepository.save(any(IncidentReadReceipt.class))).thenReturn(savedReceipt);

        IncidentReadReceipt result = receiptService.createReceipt(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testCreateReceiptIncidentNotExists() {
        IncidentReadReceiptRequestDTO dto = new IncidentReadReceiptRequestDTO(1L, 2L);

        when(incidentRepository.existsById(1L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> receiptService.createReceipt(dto));

        assertTrue(exception.getMessage().contains("incidencia"));
    }

    @Test
    void testCreateReceiptParentNotExists() {
        IncidentReadReceiptRequestDTO dto = new IncidentReadReceiptRequestDTO(1L, 2L);

        when(incidentRepository.existsById(1L)).thenReturn(true);
        when(userRepository.existsById(2L)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> receiptService.createReceipt(dto));

        assertTrue(exception.getMessage().contains("padre"));
    }

    @Test
    void testDeleteReceipt() {
        doNothing().when(receiptRepository).deleteById(1L);

        receiptService.deleteReceipt(1L);

        verify(receiptRepository, times(1)).deleteById(1L);
    }
}
