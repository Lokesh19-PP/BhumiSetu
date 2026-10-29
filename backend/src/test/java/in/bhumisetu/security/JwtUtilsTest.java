package in.bhumisetu.security;

import in.bhumisetu.domain.entity.Department;
import in.bhumisetu.domain.entity.User;
import in.bhumisetu.domain.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000L);
    }

    @Test
    void shouldGenerateAndValidateToken() {
        User user = User.builder()
                .id(1L)
                .email("citizen@bhumisetu.in")
                .fullName("Ramesh Patil")
                .role(Role.CITIZEN)
                .department(Department.builder().code("REVENUE").name("Revenue").build())
                .build();

        String token = jwtUtils.generateJwtToken(null, user);

        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("citizen@bhumisetu.in", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void shouldRejectMalformedToken() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.here"));
    }
}
