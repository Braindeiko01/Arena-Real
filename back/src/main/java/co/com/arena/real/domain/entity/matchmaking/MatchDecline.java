package co.com.arena.real.domain.entity.matchmaking;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "match_declines", uniqueConstraints = @UniqueConstraint(columnNames = {"jugador1_id", "jugador2_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchDecline {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "jugador1_id", nullable = false)
    private String jugador1Id;

    @Column(name = "jugador2_id", nullable = false)
    private String jugador2Id;

    @Column(name = "expira_en", nullable = false)
    private LocalDateTime expiraEn;
}
