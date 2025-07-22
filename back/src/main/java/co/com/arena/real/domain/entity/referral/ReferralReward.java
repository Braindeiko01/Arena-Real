package co.com.arena.real.domain.entity.referral;

import co.com.arena.real.domain.entity.Jugador;
import co.com.arena.real.domain.entity.partida.Partida;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "referral_rewards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inviter_id", nullable = false)
    private Jugador inviter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "referred_id", nullable = false)
    private Jugador referred;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partida_id", nullable = false)
    private Partida partida;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "credited_at", nullable = false)
    private LocalDateTime creditedAt;
}
