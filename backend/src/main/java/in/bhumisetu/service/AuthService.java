package in.bhumisetu.service;

import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.Role;
import in.bhumisetu.dto.auth.AuthResponse;
import in.bhumisetu.dto.auth.LoginRequest;
import in.bhumisetu.dto.auth.RegisterRequest;
import in.bhumisetu.dto.auth.UserDto;
import in.bhumisetu.exception.BadRequestException;
import in.bhumisetu.exception.ResourceNotFoundException;
import in.bhumisetu.repository.UserRepository;
import in.bhumisetu.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String jwt = jwtUtils.generateJwtToken(authentication, user);

        auditLogService.logAction(
                user.getId(),
                user.getEmail(),
                "USER_LOGIN",
                "User",
                String.valueOf(user.getId()),
                ipAddress,
                "Successful login as " + user.getRole().name()
        );

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(UserDto.fromEntity(user))
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String ipAddress) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.CITIZEN;
        // Citizens cannot self-register as ADMIN or OFFICER
        if (assignedRole != Role.CITIZEN) {
            log.warn("Self-registration defaulted to CITIZEN from requested: {}", assignedRole);
            assignedRole = Role.CITIZEN;
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(assignedRole)
                .build();

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateJwtToken(authentication, savedUser);

        auditLogService.logAction(
                savedUser.getId(),
                savedUser.getEmail(),
                "USER_REGISTERED",
                "User",
                String.valueOf(savedUser.getId()),
                ipAddress,
                "New citizen registration"
        );

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .user(UserDto.fromEntity(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDto.fromEntity(user);
    }
}
