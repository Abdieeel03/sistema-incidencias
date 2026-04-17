package com.utp.sistemaincidencias.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ParentStudentTest {

    @Test
    void testNoArgsConstructor() {
        ParentStudent ps = new ParentStudent();
        assertNotNull(ps);
        assertNull(ps.getId());
        assertNull(ps.getParent());
        assertNull(ps.getStudent());
        assertNull(ps.getCreatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        User parent = new User();
        Student student = new Student();

        ParentStudent ps = new ParentStudent(1L, parent, student, now);

        assertEquals(1L, ps.getId());
        assertSame(parent, ps.getParent());
        assertSame(student, ps.getStudent());
        assertEquals(now, ps.getCreatedAt());
    }

    @Test
    void testSettersAndGetters() {
        ParentStudent ps = new ParentStudent();
        LocalDateTime now = LocalDateTime.now();
        User parent = new User();
        Student student = new Student();

        ps.setId(2L);
        ps.setParent(parent);
        ps.setStudent(student);
        ps.setCreatedAt(now);

        assertEquals(2L, ps.getId());
        assertSame(parent, ps.getParent());
        assertSame(student, ps.getStudent());
        assertEquals(now, ps.getCreatedAt());
    }

    @Test
    void testSetParentRelation() {
        ParentStudent ps = new ParentStudent();
        User parent = new User();
        parent.setId(5L);
        parent.setName("Padre Test");

        ps.setParent(parent);

        assertEquals(5L, ps.getParent().getId());
        assertEquals("Padre Test", ps.getParent().getName());
    }

    @Test
    void testSetStudentRelation() {
        ParentStudent ps = new ParentStudent();
        Student student = new Student();
        student.setId(10L);
        student.setFirstName("Hijo Test");

        ps.setStudent(student);

        assertEquals(10L, ps.getStudent().getId());
        assertEquals("Hijo Test", ps.getStudent().getFirstName());
    }
}
