package co.com.arena.real.admin.infrastructure.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ImageDto {
    private UUID id;
    private String base64;
    private boolean approved;
}
