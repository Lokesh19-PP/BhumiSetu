package in.bhumisetu.security;

import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.Role;
import in.bhumisetu.dto.auth.AuthResponse;
import in.bhumisetu.dto.auth.LoginRequest;
import in.bhumisetu.repository.UserRepository;
import in.bhumisetu.service.AuditLogService;
import in.bhumisetu.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthService authService;

    @Test
    void testSuccessfulLogin() {
        User user = User.builder()
                .id(1L)
                .email("citizen@bhumisetu.in")
                .fullName("Ramesh Patil")
                .role(Role.CITIZEN)
                .password("encoded_pass")
                .build();

        when(userRepository.findByEmail("citizen@bhumisetu.in")).thenReturn(Optional.of(user));
        when(jwtUtils.generateJwtToken(any(), any(User.class))).thenReturn("mock-jwt-token");

        LoginRequest loginRequest = new LoginRequest("citizen@bhumisetu.in", "Demo@123");
        AuthResponse response = authService.login(loginRequest, "127.0.0.1");

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("citizen@bhumisetu.in", response.getUser().getEmail());
        assertEquals(Role.CITIZEN, response.getUser().getRole());
        verify(auditLogService, times(1)).logAction(any(), any(), eq("USER_LOGIN"), any(), any(), any(), any());
    }
}
