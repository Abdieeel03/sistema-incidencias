package com.utp.sistemaincidencias.model;

import com.utp.sistemaincidencias.model.enums.UserRole;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testNoArgsConstructor() {
        User user = new User();
        assertNotNull(user);
        assertNull(user.getId());
        assertNull(user.getName());
        assertNull(user.getEmail());
        assertNull(user.getPasswordHash());
        assertNull(user.getRole());
        assertTrue(user.getIsActive());
        assertNull(user.getCreatedAt());
        assertNull(user.getUpdatedAt());
    }

    @Test
    void testAllArgsConstructor() {
        LocalDateTime now = LocalDateTime.now();
        List<ParentStudent> parentStudents = new ArrayList<>();
        List<Section> sections = new ArrayList<>();
        List<SchoolClass> classes = new ArrayList<>();

        User user = new User(1L, "Juan", "juan@mail.com", "hash123",
                UserRole.coordinador, true, now, now,
                parentStudents, sections, classes);

        assertEquals(1L, user.getId());
        assertEquals("Juan", user.getName());
        assertEquals("juan@mail.com", user.getEmail());
        assertEquals("hash123", user.getPasswordHash());
        assertEquals(UserRole.coordinador, user.getRole());
        assertTrue(user.getIsActive());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
        assertSame(parentStudents, user.getParentStudents());
        assertSame(sections, user.getCoordinatedSections());
        assertSame(classes, user.getTaughtClasses());
    }

    @Test
    void testSettersAndGetters() {
        User user = new User();
        LocalDateTime now = LocalDateTime.now();

        user.setId(5L);
        user.setName("Maria");
        user.setEmail("maria@mail.com");
        user.setPasswordHash("secret");
        user.setRole(UserRole.profesor);
        user.setIsActive(false);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        assertEquals(5L, user.getId());
        assertEquals("Maria", user.getName());
        assertEquals("maria@mail.com", user.getEmail());
        assertEquals("secret", user.getPasswordHash());
        assertEquals(UserRole.profesor, user.getRole());
        assertFalse(user.getIsActive());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
    }

    @Test
    void testDefaultIsActiveValue() {
        User user = new User();
        assertTrue(user.getIsActive());
    }

    @Test
    void testDefaultListsAreInitialized() {
        User user = new User();
        assertNotNull(user.getParentStudents());
        assertNotNull(user.getCoordinatedSections());
        assertNotNull(user.getTaughtClasses());
        assertTrue(user.getParentStudents().isEmpty());
        assertTrue(user.getCoordinatedSections().isEmpty());
        assertTrue(user.getTaughtClasses().isEmpty());
    }

    @Test
    void testSetParentStudentsList() {
        User user = new User();
        List<ParentStudent> list = new ArrayList<>();
        list.add(new ParentStudent());
        user.setParentStudents(list);

        assertEquals(1, user.getParentStudents().size());
    }

    @Test
    void testSetCoordinatedSectionsList() {
        User user = new User();
        List<Section> list = new ArrayList<>();
        list.add(new Section());
        user.setCoordinatedSections(list);

        assertEquals(1, user.getCoordinatedSections().size());
    }

    @Test
    void testSetTaughtClassesList() {
        User user = new User();
        List<SchoolClass> list = new ArrayList<>();
        list.add(new SchoolClass());
        user.setTaughtClasses(list);

        assertEquals(1, user.getTaughtClasses().size());
    }

    @Test
    void testAllUserRoles() {
        User user = new User();

        user.setRole(UserRole.coordinador);
        assertEquals(UserRole.coordinador, user.getRole());

        user.setRole(UserRole.profesor);
        assertEquals(UserRole.profesor, user.getRole());

        user.setRole(UserRole.padre);
        assertEquals(UserRole.padre, user.getRole());
    }
}
