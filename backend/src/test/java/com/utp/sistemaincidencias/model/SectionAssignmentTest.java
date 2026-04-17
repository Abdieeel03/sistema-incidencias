package com.utp.sistemaincidencias.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class SectionAssignmentTest {

    @Test
    void testNoArgsConstructor() {
        SectionAssignment assignment = new SectionAssignment();
        assertNotNull(assignment);
        assertNull(assignment.getId());
        assertNull(assignment.getStudent());
        assertNull(assignment.getSection());
        assertNull(assignment.getSchoolClass());
        assertNull(assignment.getAssignedBy());
        assertNull(assignment.getCreatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        Student student = new Student();
        Section section = new Section();
        SchoolClass schoolClass = new SchoolClass();
        User assignedBy = new User();

        SectionAssignment assignment = new SectionAssignment(1L, student, section,
                schoolClass, assignedBy, now);

        assertEquals(1L, assignment.getId());
        assertSame(student, assignment.getStudent());
        assertSame(section, assignment.getSection());
        assertSame(schoolClass, assignment.getSchoolClass());
        assertSame(assignedBy, assignment.getAssignedBy());
        assertEquals(now, assignment.getCreatedAt());
    }

    @Test
    void testSettersAndGetters() {
        SectionAssignment assignment = new SectionAssignment();
        LocalDateTime now = LocalDateTime.now();
        Student student = new Student();
        Section section = new Section();
        SchoolClass schoolClass = new SchoolClass();
        User assignedBy = new User();

        assignment.setId(5L);
        assignment.setStudent(student);
        assignment.setSection(section);
        assignment.setSchoolClass(schoolClass);
        assignment.setAssignedBy(assignedBy);
        assignment.setCreatedAt(now);

        assertEquals(5L, assignment.getId());
        assertSame(student, assignment.getStudent());
        assertSame(section, assignment.getSection());
        assertSame(schoolClass, assignment.getSchoolClass());
        assertSame(assignedBy, assignment.getAssignedBy());
        assertEquals(now, assignment.getCreatedAt());
    }

    @Test
    void testSetStudentRelation() {
        SectionAssignment assignment = new SectionAssignment();
        Student student = new Student();
        student.setId(10L);
        student.setFirstName("Pedro");

        assignment.setStudent(student);

        assertEquals(10L, assignment.getStudent().getId());
        assertEquals("Pedro", assignment.getStudent().getFirstName());
    }

    @Test
    void testSetSectionRelation() {
        SectionAssignment assignment = new SectionAssignment();
        Section section = new Section();
        section.setId(3L);
        section.setName("C");

        assignment.setSection(section);

        assertEquals(3L, assignment.getSection().getId());
        assertEquals("C", assignment.getSection().getName());
    }
}
