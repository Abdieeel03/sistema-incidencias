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

    private User createUser(Long id, String name, String email) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setRole(UserRole.coordinador);
        user.setIsActive(true);
        return user;
    }

    private UserResponseDTO createResponseDTO(Long id, String name, String email) {
        LocalDateTime now = LocalDateTime.now();
        return new UserResponseDTO(id, name, email, UserRole.coordinador, true, now, now);
    }

    @Test
    void testGetAllUsers() {
        User user1 = createUser(1L, "Juan", "juan@mail.com");
        User user2 = createUser(2L, "Maria", "maria@mail.com");
        UserResponseDTO dto1 = createResponseDTO(1L, "Juan", "juan@mail.com");
        UserResponseDTO dto2 = createResponseDTO(2L, "Maria", "maria@mail.com");

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
        User user = createUser(1L, "Juan", "juan@mail.com");
        UserResponseDTO dto = createResponseDTO(1L, "Juan", "juan@mail.com");

        when(userService.getUserById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toResponseDTO(user)).thenReturn(dto);

        ResponseEntity<UserResponseDTO> response = userController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Juan", response.getBody().getName());
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
        User user = createUser(1L, "Juan", "juan@mail.com");
        UserResponseDTO dto = createResponseDTO(1L, "Juan", "juan@mail.com");

        when(userService.getUserByEmail("juan@mail.com")).thenReturn(Optional.of(user));
        when(userMapper.toResponseDTO(user)).thenReturn(dto);

        ResponseEntity<UserResponseDTO> response = userController.getUserByEmail("juan@mail.com");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("juan@mail.com", response.getBody().getEmail());
    }

    @Test
    void testGetUserByEmailNotFound() {
        when(userService.getUserByEmail("noexiste@mail.com")).thenReturn(Optional.empty());

        ResponseEntity<UserResponseDTO> response = userController.getUserByEmail("noexiste@mail.com");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void testCreateUser() {
        UserRequestDTO requestDTO = new UserRequestDTO("Juan", "juan@mail.com",
                "pass123", UserRole.coordinador, true);
        User createdUser = createUser(1L, "Juan", "juan@mail.com");
        UserResponseDTO responseDTO = createResponseDTO(1L, "Juan", "juan@mail.com");

        when(userService.createUser(requestDTO)).thenReturn(createdUser);
        when(userMapper.toResponseDTO(createdUser)).thenReturn(responseDTO);

        ResponseEntity<UserResponseDTO> response = userController.createUser(requestDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testUpdateUser() {
        UserRequestDTO requestDTO = new UserRequestDTO("Actualizado", "nuevo@mail.com",
                "newpass", UserRole.profesor, true);
        User updatedUser = createUser(1L, "Actualizado", "nuevo@mail.com");
        UserResponseDTO responseDTO = createResponseDTO(1L, "Actualizado", "nuevo@mail.com");

        when(userService.updateUser(1L, requestDTO)).thenReturn(updatedUser);
        when(userMapper.toResponseDTO(updatedUser)).thenReturn(responseDTO);

        ResponseEntity<UserResponseDTO> response = userController.updateUser(1L, requestDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Actualizado", response.getBody().getName());
    }

    @Test
    void testDeleteUser() {
        doNothing().when(userService).deleteUser(1L);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService, times(1)).deleteUser(1L);
    }
}
