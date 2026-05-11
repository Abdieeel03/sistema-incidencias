package com.utp.sistemaincidencias.controller;

import com.utp.sistemaincidencias.dto.UserRequestDTO;
import com.utp.sistemaincidencias.dto.UserResponseDTO;
import com.utp.sistemaincidencias.mapper.UserMapper;
import com.utp.sistemaincidencias.model.User;
import com.utp.sistemaincidencias.model.enums.UserRole;
import com.utp.sistemaincidencias.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    private User createUser(Long id, String username, String name, String dni) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setName(name);
        user.setDni(dni);
        user.setRole(UserRole.coordinador);
        user.setIsActive(true);
        return user;
    }

    private UserResponseDTO createResponseDTO(Long id, String username, String name, String dni) {
        LocalDateTime now = LocalDateTime.now();
        return new UserResponseDTO(id, username, name, dni, UserRole.coordinador, true, now, now);
    }

    @Test
    void testGetAllUsers() {
        User user1 = createUser(1L, "C123", "juan", "12345678");
        User user2 = createUser(2L, "C456", "maria", "12345678");
        UserResponseDTO dto1 = createResponseDTO(1L, "C123", "juan", "12345678");
        UserResponseDTO dto2 = createResponseDTO(2L, "C456", "maria", "12345678");

        when(userService.getAllUsers()).thenReturn(Arrays.asList(user1, user2));
        when(userMapper.toResponseDTOList(Arrays.asList(user1, user2)))
                .thenReturn(Arrays.asList(dto1, dto2));

        ResponseEntity<List<UserResponseDTO>> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        verify(userService, times(1)).getAllUsers();
    }

    @Test
    void testGetUserByIdFound() {
        User user = createUser(1L, "C123", "juan", "12345678");
        UserResponseDTO dto = createResponseDTO(1L, "C123", "juan", "12345678");

        when(userService.getUserById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponseDTO(user)).thenReturn(dto);

        ResponseEntity<UserResponseDTO> response = userController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("juan", response.getBody().getName());
    }

    @Test
    void testGetUserByIdNotFound() {
        when(userService.getUserById(99L)).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.getUserById(99L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void testGetUserByEmailFound() {
        User user = createUser(1L, "C123", "juan", "12345678");
        UserResponseDTO dto = createResponseDTO(1L, "C123", "juan", "12345678");

        when(userService.getUserByDni("12345678")).thenReturn(Optional.of(user));
        when(userMapper.toResponseDTO(user)).thenReturn(dto);

        ResponseEntity<UserResponseDTO> response = userController.getUserByDni("12345678");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("12345678", response.getBody().getDni());
    }

    @Test
    void testGetUserByEmailNotFound() {
        when(userService.getUserByDni("12345678")).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.getUserByDni("12345678");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateUser() {
        UserRequestDTO requestDTO = new UserRequestDTO("Juan", "12345678",
                "pass123", UserRole.coordinador, true);
        User createdUser = createUser(1L, "C123", "juan", "12345678");
        UserResponseDTO responseDTO = createResponseDTO(1L, "C123", "juan", "12345678");

        when(userService.createUser(requestDTO)).thenReturn(createdUser);
        when(userMapper.toResponseDTO(createdUser)).thenReturn(responseDTO);

        ResponseEntity<UserResponseDTO> response = userController.createUser(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testUpdateUser() {
        UserRequestDTO requestDTO = new UserRequestDTO("actualizado", "12345678",
                "newpass", UserRole.profesor, true);
        User updatedUser = createUser(1L, "C123", "actualizado", "12345678");
        UserResponseDTO responseDTO = createResponseDTO(1L, "C123", "actualizado", "12345678");

        when(userService.updateUser(1L, requestDTO)).thenReturn(updatedUser);
        when(userMapper.toResponseDTO(updatedUser)).thenReturn(responseDTO);

        ResponseEntity<UserResponseDTO> response = userController.updateUser(1L, requestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("actualizado", response.getBody().getName());
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userService).deleteUser(1L);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService, times(1)).deleteUser(1L);
    }
}
