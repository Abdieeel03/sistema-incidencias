package com.utp.sistemaincidencias.service.impl;

import com.utp.sistemaincidencias.dto.AuthRequestDTO;
import com.utp.sistemaincidencias.dto.AuthResponseDTO;
import com.utp.sistemaincidencias.security.CustomUserDetails;
import com.utp.sistemaincidencias.security.JwtService;
import com.utp.sistemaincidencias.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public AuthResponseDTO login(AuthRequestDTO request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails principal = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(principal.getUser());

        return new AuthResponseDTO(
                token,
                principal.getUser().getId(),
                principal.getUser().getEmail(),
                principal.getUser().getRole()
        );
    }
}

