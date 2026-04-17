package com.utp.sistemaincidencias.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SectionTest {

    @Test
    void testNoArgsConstructor() {
        Section section = new Section();
        assertNotNull(section);
        assertNull(section.getId());
        assertNull(section.getName());
        assertNull(section.getGrade());
        assertNull(section.getCapacity());
        assertNull(section.getCoordinator());
        assertNull(section.getCreatedAt());
        assertNull(section.getUpdatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        User coordinator = new User();
        List<SchoolClass> classes = new ArrayList<>();
        List<SectionAssignment> assignments = new ArrayList<>();

        Section section = new Section(1L, "A", "Primero", (short) 30,
                coordinator, now, now, classes, assignments);

        assertEquals(1L, section.getId());
        assertEquals("A", section.getName());
        assertEquals("Primero", section.getGrade());
        assertEquals((short) 30, section.getCapacity());
        assertSame(coordinator, section.getCoordinator());
        assertEquals(now, section.getCreatedAt());
        assertEquals(now, section.getUpdatedAt());
        assertSame(classes, section.getClasses());
        assertSame(assignments, section.getSectionAssignments());
    }

    @Test
    void testSettersAndGetters() {
        Section section = new Section();
        LocalDateTime now = LocalDateTime.now();
        User coordinator = new User();

        section.setId(2L);
        section.setName("B");
        section.setGrade("Segundo");
        section.setCapacity((short) 25);
        section.setCoordinator(coordinator);
        section.setCreatedAt(now);
        section.setUpdatedAt(now);

        assertEquals(2L, section.getId());
        assertEquals("B", section.getName());
        assertEquals("Segundo", section.getGrade());
        assertEquals((short) 25, section.getCapacity());
        assertSame(coordinator, section.getCoordinator());
        assertEquals(now, section.getCreatedAt());
        assertEquals(now, section.getUpdatedAt());
    }

    @Test
    void testDefaultListsAreInitialized() {
        Section section = new Section();
        assertNotNull(section.getClasses());
        assertNotNull(section.getSectionAssignments());
        assertTrue(section.getClasses().isEmpty());
        assertTrue(section.getSectionAssignments().isEmpty());
    }

    @Test
    void testSetClassesList() {
        Section section = new Section();
        List<SchoolClass> list = new ArrayList<>();
        list.add(new SchoolClass());
        section.setClasses(list);

        assertEquals(1, section.getClasses().size());
    }

    @Test
    void testSetSectionAssignmentsList() {
        Section section = new Section();
        List<SectionAssignment> list = new ArrayList<>();
        list.add(new SectionAssignment());
        section.setSectionAssignments(list);

        assertEquals(1, section.getSectionAssignments().size());
    }
}
