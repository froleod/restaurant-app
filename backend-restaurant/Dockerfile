## Этап сборки
#FROM maven:3.9.9-amazoncorretto-8-debian-bookworm AS build
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn clean package -DskipTests  # Собираем проект, пропуская тесты
#
## Этап запуска
#FROM amazoncorretto:17.0.7-alpine
#WORKDIR /app
#COPY --from=build /app/target/my-backend-app-*.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "app.jar"]
FROM amazoncorretto:17.0.7-alpine
ADD target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8080