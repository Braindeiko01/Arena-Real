package co.com.arena.real.infrastructure.repository;

import co.com.arena.real.domain.entity.referral.ReferralReward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ReferralRewardRepository extends JpaRepository<ReferralReward, Long> {

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM ReferralReward r WHERE r.inviter.id = :inviterId")
    BigDecimal totalEarnedByInviter(@Param("inviterId") String inviterId);

    List<ReferralReward> findByInviter_Id(String inviterId);
}
