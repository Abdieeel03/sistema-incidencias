package com.utp.sistemaincidencias.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SchoolClassTest {

    @Test
    void testNoArgsConstructor() {
        SchoolClass schoolClass = new SchoolClass();
        assertNotNull(schoolClass);
        assertNull(schoolClass.getId());
        assertNull(schoolClass.getName());
        assertNull(schoolClass.getDescription());
        assertNull(schoolClass.getTeacher());
        assertNull(schoolClass.getSection());
        assertNull(schoolClass.getCreatedAt());
        assertNull(schoolClass.getUpdatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        User teacher = new User();
        Section section = new Section();
        List<SectionAssignment> assignments = new ArrayList<>();
        List<Incident> incidents = new ArrayList<>();

        SchoolClass schoolClass = new SchoolClass(1L, "Matemáticas", "Curso de mate",
                teacher, section, now, now, assignments, incidents);

        assertEquals(1L, schoolClass.getId());
        assertEquals("Matemáticas", schoolClass.getName());
        assertEquals("Curso de mate", schoolClass.getDescription());
        assertSame(teacher, schoolClass.getTeacher());
        assertSame(section, schoolClass.getSection());
        assertEquals(now, schoolClass.getCreatedAt());
        assertEquals(now, schoolClass.getUpdatedAt());
        assertSame(assignments, schoolClass.getSectionAssignments());
        assertSame(incidents, schoolClass.getIncidents());
    }

    @Test
    void testSettersAndGetters() {
        SchoolClass schoolClass = new SchoolClass();
        LocalDateTime now = LocalDateTime.now();
        User teacher = new User();
        Section section = new Section();

        schoolClass.setId(2L);
        schoolClass.setName("Ciencias");
        schoolClass.setDescription("Curso de ciencias");
        schoolClass.setTeacher(teacher);
        schoolClass.setSection(section);
        schoolClass.setCreatedAt(now);
        schoolClass.setUpdatedAt(now);

        assertEquals(2L, schoolClass.getId());
        assertEquals("Ciencias", schoolClass.getName());
        assertEquals("Curso de ciencias", schoolClass.getDescription());
        assertSame(teacher, schoolClass.getTeacher());
        assertSame(section, schoolClass.getSection());
        assertEquals(now, schoolClass.getCreatedAt());
        assertEquals(now, schoolClass.getUpdatedAt());
    }

    @Test
    void testDefaultListsAreInitialized() {
        SchoolClass schoolClass = new SchoolClass();
        assertNotNull(schoolClass.getSectionAssignments());
        assertNotNull(schoolClass.getIncidents());
        assertTrue(schoolClass.getSectionAssignments().isEmpty());
        assertTrue(schoolClass.getIncidents().isEmpty());
    }

    @Test
    void testSetSectionAssignmentsList() {
        SchoolClass schoolClass = new SchoolClass();
        List<SectionAssignment> list = new ArrayList<>();
        list.add(new SectionAssignment());
        schoolClass.setSectionAssignments(list);

        assertEquals(1, schoolClass.getSectionAssignments().size());
    }

    @Test
    void testSetIncidentsList() {
        SchoolClass schoolClass = new SchoolClass();
        List<Incident> list = new ArrayList<>();
        list.add(new Incident());
        schoolClass.setIncidents(list);

        assertEquals(1, schoolClass.getIncidents().size());
    }
}
