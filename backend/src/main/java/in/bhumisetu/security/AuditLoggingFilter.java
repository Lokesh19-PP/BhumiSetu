package in.bhumisetu.security;

import in.bhumisetu.service.AuditLogService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuditLoggingFilter extends OncePerRequestFilter {

    private final AuditLogService auditLogService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        filterChain.doFilter(request, response);

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Audit log state-modifying API calls or sensitive actions
        if (path.startsWith("/api/") && (!"GET".equalsIgnoreCase(method) || path.contains("/dossier") || path.contains("/auth/me"))) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = "anonymous";
            Long userId = null;

            if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
                userEmail = userDetails.getEmail();
                userId = userDetails.getId();
            }

            String clientIp = request.getHeader("X-Forwarded-For");
            if (clientIp == null || clientIp.isEmpty()) {
                clientIp = request.getRemoteAddr();
            }

            auditLogService.logAction(
                    userId,
                    userEmail,
                    method + " " + path,
                    "HTTP_REQUEST",
                    String.valueOf(response.getStatus()),
                    clientIp,
                    "Status: " + response.getStatus() + " | Method: " + method
            );
        }
    }
}
