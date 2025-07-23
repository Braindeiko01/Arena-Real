package co.com.arena.real.infrastructure.dto.rq;

import lombok.Data;

@Data
public class ShareLinkRequest {
    private String link;
    private String text;
}
