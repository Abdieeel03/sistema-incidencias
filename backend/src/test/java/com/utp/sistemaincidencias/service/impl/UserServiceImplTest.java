package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.UserRequestDTO;
import com.utp.sistemaincidencias.mapper.UserMapper;
import com.utp.sistemaincidencias.model.User;
import com.utp.sistemaincidencias.model.enums.UserRole;
import com.utp.sistemaincidencias.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testGetAllUsers() {
        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllUsersEmpty() {
        when(userRepository.findAll()).thenReturn(List.of());

        List<User> result = userService.getAllUsers();

        assertTrue(result.isEmpty());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetUserByIdFound() {
        User user = new User();
        user.setId(1L);
        user.setName("Juan");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(1L);

        assertTrue(result.isPresent());
        assertEquals("Juan", result.get().getName());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserByIdNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserById(99L);

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    void testGetUserByEmailFound() {
        User user = new User();
        user.setDni("12345678");

        when(userRepository.findByDni("12345678")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByDni("12345678");

        assertTrue(result.isPresent());
        assertEquals("12345678", result.get().getDni());
        verify(userRepository, times(1)).findByDni("12345678");
    }

    @Test
    void testGetUserByEmailNotFound() {
        when(userRepository.findByDni("12345678")).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserByDni("12345678");

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByDni("12345678");
    }

    @Test
    void testCreateUserSuccess() {
        UserRequestDTO dto = new UserRequestDTO("Juan", "12345678",
                "pass123", UserRole.coordinador, true);
        User mappedUser = new User();
        mappedUser.setName("Juan");
        mappedUser.setDni("12345678");
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Juan");

        when(userRepository.existsByDni("12345678")).thenReturn(false);
        when(userMapper.toEntity(dto)).thenReturn(mappedUser);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.createUser(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(userRepository, times(1)).existsByDni("12345678");
        verify(userMapper, times(1)).toEntity(dto);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUserDuplicateEmail() {
        UserRequestDTO dto = new UserRequestDTO("Juan", "12345678",
                "pass123", UserRole.coordinador, true);

        when(userRepository.existsByDni("12345678")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.createUser(dto));

        assertEquals("El dni ya está registrado", exception.getMessage());
        verify(userRepository, times(1)).existsByDni("12345678");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateUserSuccess() {
        UserRequestDTO dto = new UserRequestDTO("Actualizado", "12345678",
                "newpass", UserRole.profesor, true);
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setName("Original");
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Actualizado");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        doNothing().when(userMapper).updateEntity(dto, existingUser);
        when(userRepository.save(existingUser)).thenReturn(savedUser);

        User result = userService.updateUser(1L, dto);

        assertNotNull(result);
        assertEquals("Actualizado", result.getName());
        verify(userRepository, times(1)).findById(1L);
        verify(userMapper, times(1)).updateEntity(dto, existingUser);
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    void testUpdateUserNotFound() {
        UserRequestDTO dto = new UserRequestDTO("Test", "12345678",
                "pass", UserRole.padre, true);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.updateUser(99L, dto));

        assertTrue(exception.getMessage().contains("Usuario no encontrado"));
        verify(userRepository, times(1)).findById(99L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }
}
