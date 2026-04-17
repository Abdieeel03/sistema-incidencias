package com.utp.sistemaincidencias.model.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class IncidentStatusTest {

    @Test
    void testIncidentStatusValues() {
        IncidentStatus[] statuses = IncidentStatus.values();
        assertEquals(4, statuses.length);
    }

    @Test
    void testAbiertaStatus() {
        assertEquals("abierta", IncidentStatus.abierta.name());
    }

    @Test
    void testEnProcesoStatus() {
        assertEquals("en_proceso", IncidentStatus.en_proceso.name());
    }

    @Test
    void testResueltaStatus() {
        assertEquals("resuelta", IncidentStatus.resuelta.name());
    }

    @Test
    void testArchivadaStatus() {
        assertEquals("archivada", IncidentStatus.archivada.name());
    }

    @Test
    void testValueOf() {
        assertEquals(IncidentStatus.abierta, IncidentStatus.valueOf("abierta"));
        assertEquals(IncidentStatus.en_proceso, IncidentStatus.valueOf("en_proceso"));
        assertEquals(IncidentStatus.resuelta, IncidentStatus.valueOf("resuelta"));
        assertEquals(IncidentStatus.archivada, IncidentStatus.valueOf("archivada"));
    }

    @Test
    void testInvalidValueOfThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> IncidentStatus.valueOf("cerrada"));
    }
}
