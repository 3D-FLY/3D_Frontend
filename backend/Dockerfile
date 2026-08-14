# Build stage
FROM gradle:8.10-jdk21 AS build
WORKDIR /workspace
COPY . .
RUN gradle :app:bootJar --no-daemon

# Runtime stage — one image for both modes; ECS selects the mode via
# SPRING_PROFILES_ACTIVE=api|worker on the task definition.
FROM eclipse-temurin:21-jre
RUN groupadd --system spring && useradd --system --gid spring spring
USER spring
WORKDIR /app
COPY --from=build /workspace/app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
