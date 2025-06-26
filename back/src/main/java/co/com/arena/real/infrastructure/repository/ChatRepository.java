package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {

    @Query("SELECT c FROM Chat c WHERE c.activo = true AND :j1 MEMBER OF c.jugadores AND :j2 MEMBER OF c.jugadores")
    java.util.Optional<Chat> findBetween(@Param("j1") String jugador1Id, @Param("j2") String jugador2Id);
}
