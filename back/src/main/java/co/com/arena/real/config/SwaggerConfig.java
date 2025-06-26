package co.com.arena.real.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        Server prodServer = new Server()
                .url("https://crduels-crduelsproduction.up.railway.app")
                .description("Producción - Railway");

        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Desarrollo Local");

        return new OpenAPI()
                .info(new Info()
                        .title("CRDuels API")
                        .version("1.0")
                        .description("Documentación para CRDuels"))
                .servers(List.of(localServer, prodServer)); // orden importa, local primero
    }
}
