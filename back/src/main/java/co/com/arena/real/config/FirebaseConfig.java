package co.com.arena.real.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        String serviceAccountPath = System.getenv("FIREBASE_SERVICE_ACCOUNT_FILE");
        if (serviceAccountPath == null) {
            serviceAccountPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
        }

        GoogleCredentials credentials;
        if (serviceAccountPath != null) {
            try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
                credentials = GoogleCredentials.fromStream(serviceAccount);
            }
        } else {
            credentials = GoogleCredentials.getApplicationDefault();
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        return FirebaseApp.initializeApp(options);
    }
}
