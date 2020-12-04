FROM maven:3-openjdk-11-slim AS build
WORKDIR /app

COPY ./pom.xml ./pom.xml
COPY ./mvn/settings.xml /usr/share/maven/conf/settings.xml

RUN mvn dependency:go-offline -B
COPY ./src ./src

ENTRYPOINT [ "mvn", "spring-boot:run" ]