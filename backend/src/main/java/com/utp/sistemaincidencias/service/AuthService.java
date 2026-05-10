package com.utp.sistemaincidencias.service;

import com.utp.sistemaincidencias.dto.AuthRequestDTO;
import com.utp.sistemaincidencias.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(AuthRequestDTO request);
}

