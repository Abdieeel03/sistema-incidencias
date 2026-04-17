package com.utp.sistemaincidencias.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class IncidentReadReceiptTest {

    @Test
    void testNoArgsConstructor() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        assertNotNull(receipt);
        assertNull(receipt.getId());
        assertNull(receipt.getIncident());
        assertNull(receipt.getParent());
        assertNull(receipt.getReadAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        Incident incident = new Incident();
        User parent = new User();

        IncidentReadReceipt receipt = new IncidentReadReceipt(1L, incident, parent, now);

        assertEquals(1L, receipt.getId());
        assertSame(incident, receipt.getIncident());
        assertSame(parent, receipt.getParent());
        assertEquals(now, receipt.getReadAt());
    }

    @Test
    void testSettersAndGetters() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        LocalDateTime now = LocalDateTime.now();
        Incident incident = new Incident();
        User parent = new User();

        receipt.setId(3L);
        receipt.setIncident(incident);
        receipt.setParent(parent);
        receipt.setReadAt(now);

        assertEquals(3L, receipt.getId());
        assertSame(incident, receipt.getIncident());
        assertSame(parent, receipt.getParent());
        assertEquals(now, receipt.getReadAt());
    }

    @Test
    void testSetIncidentRelation() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        Incident incident = new Incident();
        incident.setId(7L);
        incident.setTitle("Test Incident");

        receipt.setIncident(incident);

        assertEquals(7L, receipt.getIncident().getId());
        assertEquals("Test Incident", receipt.getIncident().getTitle());
    }

    @Test
    void testSetParentRelation() {
        IncidentReadReceipt receipt = new IncidentReadReceipt();
        User parent = new User();
        parent.setId(8L);
        parent.setName("Padre Test");

        receipt.setParent(parent);

        assertEquals(8L, receipt.getParent().getId());
        assertEquals("Padre Test", receipt.getParent().getName());
    }
}
