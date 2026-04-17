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
        user.setEmail("juan@mail.com");

        when(userRepository.findByEmail("juan@mail.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByEmail("juan@mail.com");

        assertTrue(result.isPresent());
        assertEquals("juan@mail.com", result.get().getEmail());
        verify(userRepository, times(1)).findByEmail("juan@mail.com");
    }

    @Test
    void testGetUserByEmailNotFound() {
        when(userRepository.findByEmail("noexiste@mail.com")).thenReturn(Optional.empty());

        Optional<User> result = userService.getUserByEmail("noexiste@mail.com");

        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByEmail("noexiste@mail.com");
    }

    @Test
    void testCreateUserSuccess() {
        UserRequestDTO dto = new UserRequestDTO("Juan", "juan@mail.com",
                "pass123", UserRole.coordinador, true);
        User mappedUser = new User();
        mappedUser.setName("Juan");
        mappedUser.setEmail("juan@mail.com");
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName("Juan");

        when(userRepository.existsByEmail("juan@mail.com")).thenReturn(false);
        when(userMapper.toEntity(dto)).thenReturn(mappedUser);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.createUser(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(userRepository, times(1)).existsByEmail("juan@mail.com");
        verify(userMapper, times(1)).toEntity(dto);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testCreateUserDuplicateEmail() {
        UserRequestDTO dto = new UserRequestDTO("Juan", "duplicado@mail.com",
                "pass123", UserRole.coordinador, true);

        when(userRepository.existsByEmail("duplicado@mail.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> userService.createUser(dto));

        assertEquals("El email ya está registrado", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail("duplicado@mail.com");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateUserSuccess() {
        UserRequestDTO dto = new UserRequestDTO("Actualizado", "nuevo@mail.com",
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
        UserRequestDTO dto = new UserRequestDTO("Test", "test@mail.com",
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
