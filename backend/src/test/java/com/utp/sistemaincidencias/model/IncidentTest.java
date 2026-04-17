package com.utp.sistemaincidencias.model;

import com.utp.sistemaincidencias.model.enums.IncidentStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class IncidentTest {

    @Test
    void testNoArgsConstructor() {
        Incident incident = new Incident();
        assertNotNull(incident);
        assertNull(incident.getId());
        assertNull(incident.getTitle());
        assertNull(incident.getDescription());
        assertNull(incident.getStudent());
        assertNull(incident.getSchoolClass());
        assertNull(incident.getReportedBy());
        assertEquals(IncidentStatus.abierta, incident.getStatus());
        assertNull(incident.getIncidentDate());
        assertNull(incident.getCreatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        Student student = new Student();
        SchoolClass schoolClass = new SchoolClass();
        User reporter = new User();
        List<IncidentReadReceipt> receipts = new ArrayList<>();

        Incident incident = new Incident(1L, "Pelea", "Descripción de pelea",
                student, schoolClass, reporter,
                IncidentStatus.en_proceso, now, now, receipts);

        assertEquals(1L, incident.getId());
        assertEquals("Pelea", incident.getTitle());
        assertEquals("Descripción de pelea", incident.getDescription());
        assertSame(student, incident.getStudent());
        assertSame(schoolClass, incident.getSchoolClass());
        assertSame(reporter, incident.getReportedBy());
        assertEquals(IncidentStatus.en_proceso, incident.getStatus());
        assertEquals(now, incident.getIncidentDate());
        assertEquals(now, incident.getCreatedAt());
        assertSame(receipts, incident.getReadReceipts());
    }

    @Test
    void testSettersAndGetters() {
        Incident incident = new Incident();
        LocalDateTime now = LocalDateTime.now();
        Student student = new Student();
        SchoolClass schoolClass = new SchoolClass();
        User reporter = new User();

        incident.setId(3L);
        incident.setTitle("Tardanza");
        incident.setDescription("Llegó tarde");
        incident.setStudent(student);
        incident.setSchoolClass(schoolClass);
        incident.setReportedBy(reporter);
        incident.setStatus(IncidentStatus.resuelta);
        incident.setIncidentDate(now);
        incident.setCreatedAt(now);

        assertEquals(3L, incident.getId());
        assertEquals("Tardanza", incident.getTitle());
        assertEquals("Llegó tarde", incident.getDescription());
        assertSame(student, incident.getStudent());
        assertSame(schoolClass, incident.getSchoolClass());
        assertSame(reporter, incident.getReportedBy());
        assertEquals(IncidentStatus.resuelta, incident.getStatus());
        assertEquals(now, incident.getIncidentDate());
        assertEquals(now, incident.getCreatedAt());
    }

    @Test
    void testDefaultStatusIsAbierta() {
        Incident incident = new Incident();
        assertEquals(IncidentStatus.abierta, incident.getStatus());
    }

    @Test
    void testDefaultReadReceiptsListIsInitialized() {
        Incident incident = new Incident();
        assertNotNull(incident.getReadReceipts());
        assertTrue(incident.getReadReceipts().isEmpty());
    }

    @Test
    void testSetReadReceiptsList() {
        Incident incident = new Incident();
        List<IncidentReadReceipt> list = new ArrayList<>();
        list.add(new IncidentReadReceipt());
        incident.setReadReceipts(list);

        assertEquals(1, incident.getReadReceipts().size());
    }

    @Test
    void testAllIncidentStatuses() {
        Incident incident = new Incident();

        incident.setStatus(IncidentStatus.abierta);
        assertEquals(IncidentStatus.abierta, incident.getStatus());

        incident.setStatus(IncidentStatus.en_proceso);
        assertEquals(IncidentStatus.en_proceso, incident.getStatus());

        incident.setStatus(IncidentStatus.resuelta);
        assertEquals(IncidentStatus.resuelta, incident.getStatus());

        incident.setStatus(IncidentStatus.archivada);
        assertEquals(IncidentStatus.archivada, incident.getStatus());
    }
}
