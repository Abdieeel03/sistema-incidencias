package com.utp.sistemaincidencias.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class StudentTest {

    @Test
    void testNoArgsConstructor() {
        Student student = new Student();
        assertNotNull(student);
        assertNull(student.getId());
        assertNull(student.getFirstName());
        assertNull(student.getLastName());
        assertNull(student.getBirthDate());
        assertNull(student.getStudentCode());
        assertTrue(student.getIsActive());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDate birthDate = LocalDate.of(2010, 5, 15);
        LocalDateTime now = LocalDateTime.now();
        List<ParentStudent> parentStudents = new ArrayList<>();
        List<SectionAssignment> sectionAssignments = new ArrayList<>();
        List<Incident> incidents = new ArrayList<>();

        Student student = new Student(1L, "Carlos", "Pérez", birthDate,
                "STU001", true, now, now,
                parentStudents, sectionAssignments, incidents);

        assertEquals(1L, student.getId());
        assertEquals("Carlos", student.getFirstName());
        assertEquals("Pérez", student.getLastName());
        assertEquals(birthDate, student.getBirthDate());
        assertEquals("STU001", student.getStudentCode());
        assertTrue(student.getIsActive());
        assertEquals(now, student.getCreatedAt());
        assertEquals(now, student.getUpdatedAt());
        assertSame(parentStudents, student.getParentStudents());
        assertSame(sectionAssignments, student.getSectionAssignments());
        assertSame(incidents, student.getIncidents());
    }

    @Test
    void testSettersAndGetters() {
        Student student = new Student();
        LocalDate birthDate = LocalDate.of(2012, 3, 20);
        LocalDateTime now = LocalDateTime.now();

        student.setId(10L);
        student.setFirstName("Ana");
        student.setLastName("López");
        student.setBirthDate(birthDate);
        student.setStudentCode("STU010");
        student.setIsActive(false);
        student.setCreatedAt(now);
        student.setUpdatedAt(now);

        assertEquals(10L, student.getId());
        assertEquals("Ana", student.getFirstName());
        assertEquals("López", student.getLastName());
        assertEquals(birthDate, student.getBirthDate());
        assertEquals("STU010", student.getStudentCode());
        assertFalse(student.getIsActive());
        assertEquals(now, student.getCreatedAt());
        assertEquals(now, student.getUpdatedAt());
    }

    @Test
    void testDefaultIsActiveValue() {
        Student student = new Student();
        assertTrue(student.getIsActive());
    }

    @Test
    void testDefaultListsAreInitialized() {
        Student student = new Student();
        assertNotNull(student.getParentStudents());
        assertNotNull(student.getSectionAssignments());
        assertNotNull(student.getIncidents());
        assertTrue(student.getParentStudents().isEmpty());
        assertTrue(student.getSectionAssignments().isEmpty());
        assertTrue(student.getIncidents().isEmpty());
    }

    @Test
    void testSetParentStudentsList() {
        Student student = new Student();
        List<ParentStudent> list = new ArrayList<>();
        list.add(new ParentStudent());
        student.setParentStudents(list);

        assertEquals(1, student.getParentStudents().size());
    }

    @Test
    void testSetSectionAssignmentsList() {
        Student student = new Student();
        List<SectionAssignment> list = new ArrayList<>();
        list.add(new SectionAssignment());
        student.setSectionAssignments(list);

        assertEquals(1, student.getSectionAssignments().size());
    }

    @Test
    void testSetIncidentsList() {
        Student student = new Student();
        List<Incident> list = new ArrayList<>();
        list.add(new Incident());
        student.setIncidents(list);

        assertEquals(1, student.getIncidents().size());
    }
}
