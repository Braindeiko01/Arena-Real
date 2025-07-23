package co.com.arena.real.application.controller.log;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Slf4j
@Component
public class ControllerLoggingAspect {

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object logInOut(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getSignature().getDeclaringType().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        // Log de entrada
        log.info("[IN] \t{}.{} \t: {}", className, methodName, Arrays.toString(joinPoint.getArgs()));

        Object result;
        try {
            result = joinPoint.proceed();
        } catch (Throwable ex) {
            log.error("[ERR]\t{}.{}: {}", className, methodName, ex.getMessage(), ex);
            throw ex;
        }

        // Log de salida
        log.info("[OUT]\t{}.{} \t: {}+", className, methodName, result);

        return result;
    }
}