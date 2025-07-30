package co.com.arena.real.application.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.ObjectProvider;

public class TokenValidationServiceTest {

    @Test
    void returnsJwtForFirebaseToken() throws Exception {
        FirebaseToken fbToken = mock(FirebaseToken.class);
        when(fbToken.getUid()).thenReturn("123");
        when(fbToken.getClaims()).thenReturn(Map.of("foo", "bar", "iat", 1000L, "exp", 2000L));
        FirebaseApp app = mock(FirebaseApp.class);
        ObjectProvider<FirebaseApp> provider = () -> app;

        try (MockedStatic<FirebaseAuth> firebaseAuthMock = mockStatic(FirebaseAuth.class)) {
            FirebaseAuth auth = mock(FirebaseAuth.class);
            when(auth.verifyIdToken("token")).thenReturn(fbToken);
            firebaseAuthMock.when(() -> FirebaseAuth.getInstance(app)).thenReturn(auth);

            TokenValidationService svc = new TokenValidationService(null, provider);
            var result = svc.validate("token");
            assertThat(result).isPresent();
            assertThat(result.get().getSubject()).isEqualTo("123");
            assertThat(result.get().getClaimAsBoolean("firebase")).isTrue();
        }
    }
}
