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
        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            serviceAccountPath = System.getenv("GOOGLE_APPLICATION_CREDENTIALS");
        }

        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            throw new IllegalStateException("❌ No se encontró la ruta del archivo de credenciales de Firebase. Asegúrate de definir FIREBASE_SERVICE_ACCOUNT_FILE o GOOGLE_APPLICATION_CREDENTIALS como variable de entorno.");
        }

        System.out.println("✅ Ruta del archivo de servicio Firebase: " + serviceAccountPath);

        GoogleCredentials credentials;
        try (FileInputStream serviceAccount = new FileInputStream(serviceAccountPath)) {
            credentials = GoogleCredentials.fromStream(serviceAccount);
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        FirebaseApp app = FirebaseApp.initializeApp(options);
        System.out.println("Firebase inicializado con: " + app.getName());
        return app;
    }
}
