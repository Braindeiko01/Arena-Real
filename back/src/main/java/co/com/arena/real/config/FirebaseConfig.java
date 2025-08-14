package co.com.arena.real.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.messaging.FirebaseMessaging;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Bean
    @ConditionalOnProperty(prefix = "firebase", name = "enabled", havingValue = "true")
    public FirebaseApp firebaseApp(
            @Value("${FIREBASE_SERVICE_ACCOUNT_FILE:}") String firebaseServiceAccount,
            @Value("${GOOGLE_APPLICATION_CREDENTIALS:}") String googleCredentialsPath
    ) throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        String serviceAccountPath = firebaseServiceAccount;
        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            serviceAccountPath = googleCredentialsPath;
        }

        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            throw new IllegalStateException(
                    "Firebase credentials file not found. Set FIREBASE_SERVICE_ACCOUNT_FILE or GOOGLE_APPLICATION_CREDENTIALS.");
        }

        log.debug("Firebase service file path: {}", serviceAccountPath);

        GoogleCredentials credentials;
        try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
            credentials = GoogleCredentials.fromStream(serviceAccount);
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        FirebaseApp app = FirebaseApp.initializeApp(options);
        log.info("Firebase inicializado con: {}", app.getName());
        return app;
    }

    @Bean
    @ConditionalOnBean(FirebaseApp.class)
    public FirebaseMessaging firebaseMessaging(FirebaseApp firebaseApp) {
        return FirebaseMessaging.getInstance(firebaseApp);
    }

    @Bean
    @ConditionalOnBean(FirebaseApp.class)
    public FirebaseAuth firebaseAuth(FirebaseApp firebaseApp) {
        return FirebaseAuth.getInstance(firebaseApp);
    }
}
