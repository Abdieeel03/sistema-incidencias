package com.utp.sistemaincidencias.model.enums;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserRoleTest {

    @Test
    void testUserRoleValues() {
        UserRole[] roles = UserRole.values();
        assertEquals(3, roles.length);
    }

    @Test
    void testCoordinadorRole() {
        assertEquals("coordinador", UserRole.coordinador.name());
    }

    @Test
    void testProfesorRole() {
        assertEquals("profesor", UserRole.profesor.name());
    }

    @Test
    void testPadreRole() {
        assertEquals("padre", UserRole.padre.name());
    }

    @Test
    void testValueOf() {
        assertEquals(UserRole.coordinador, UserRole.valueOf("coordinador"));
        assertEquals(UserRole.profesor, UserRole.valueOf("profesor"));
        assertEquals(UserRole.padre, UserRole.valueOf("padre"));
    }

    @Test
    void testInvalidValueOfThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> UserRole.valueOf("admin"));
    }
}
