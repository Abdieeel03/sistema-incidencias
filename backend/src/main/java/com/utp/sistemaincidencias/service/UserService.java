package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.UserRequestDTO;
import com.utp.sistemaincidencias.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User createUser(UserRequestDTO dto);
    User updateUser(Long id, UserRequestDTO dto);
    void deleteUser(Long id);
}
