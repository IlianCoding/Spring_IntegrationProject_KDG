# Machiavelli Application

Welkom bij de **Machiavelli Application**! Deze applicatie is ontworpen om een complexe, modulaire applicatie te ondersteunen met verschillende functionaliteiten zoals spelbeheer, gebruikersprofielen, uitnodigingen, toernooien, statistieken en meer. Dit README-bestand helpt nieuwe ontwikkelaars om snel aan de slag te gaan en inzicht te krijgen in de structuur en werking van de applicatie.

---

## 📋 Overzicht van de projectstructuur
De applicatie is modulair opgebouwd, met een duidelijke scheiding van verantwoordelijkheden. Hieronder volgt een overzicht van de hoofdmappen en hun inhoud:

### 1. **`config`**
Bevat configuratieklassen die nodig zijn voor de opzet en werking van de applicatie. Enkele belangrijke configuraties:
- **`AppConfig`**: Algemene applicatieconfiguratie.
- **`AuditingConfig`**: Logging en audit-instellingen.
- **`KafkaConfig`**: Configuratie voor Apache Kafka.
- **`SecurityConfig`**: Beveiligingsinstellingen.
- **`LocaleConfig`**: Taal- en lokalisatie-instellingen.

### 2. **`controllers`**
Hier bevinden zich de REST-controllers die de basis vormen voor de API van de applicatie. Deze controllers verwerken inkomende verzoeken van clients en gebruiken services om gegevens te verwerken. Voorbeelden:
- **`GameController`**: Verwerking van spellen-gerelateerde verzoeken.
- **`LobbyController`**: Lobby-functionaliteiten.
- **`ProfileController`**: Gebruikersprofielen en instellingen.

### 3. **`dto` (Data Transfer Objects)**
DTOS worden gebruikt voor het uitwisselen van gegevens tussen de client en server. Voorbeelden:
- **`GameDto`**: DTO voor spelinformatie.
- **`ProfileDto`**: DTO voor gebruikersprofielen.
- **`StatisticsResponseDto`**: DTO voor terugkoppeling van statistische gegevens.

### 4. **`exceptionhandler`**
Klassen zoals **`GlobalExceptionHandler`** zijn verantwoordelijk voor het verwerken van uitzonderingen en het geven van betekenisvolle foutmeldingen aan de client.

### 5. **`mappers`**
Mappers worden gebruikt om domeinobjecten en DTO's naar elkaar te converteren. Voorbeelden:
- **`GameMapper`**
- **`ProfileMapper`**
- **`RoundMapper`**

### 6. **`domain`**
Bevat de kern van de applicatie, zoals domeinmodellen, enumeraties en entiteiten. Voorbeelden:
- **Entiteiten**: `Game`, `Player`, `Profile`, `Round`
- **Enumeraties**: `GameEventType`, `Color`, `TurnFase`

### 7. **`exception`**
Aangepaste uitzonderingen om fouten specifiek en inzichtelijk te kunnen behandelen. Voorbeelden:
- **`GameNotFoundException`**
- **`PlayerStateException`**
- **`UnauthorizedCharacterActionException`**

### 8. **`notificationchannels`**
Bevat kanalen voor notificaties, zoals:
- **`Discord`**: Configuratie en events voor berichten naar Discord.
- **`email`**: Functionaliteiten voor het versturen van e-mails.

### 9. **`repositories`**
Interfaces voor het gebruik van de database (via JPA/Hibernate). Repositories zoals:
- **`GameRepository`**
- **`PlayerRepository`**
- **`LobbyRepository`**

### 10. **`services`**
Services bevatten de kernlogica van de applicatie. Voorbeelden:
- **`GameService`**: Verwerking van spelgerelateerde logica.
- **`InvitationService`**: Beheer van uitnodigingen.
- **`LeaderboardService`**: Logica voor ranglijsten.

---

## 🚀 Installatiehandleiding
Volg de onderstaande stappen om de applicatie lokaal te draaien:

### 1. Vereisten
- **Java 21**: Zorg ervoor dat de Java SDK 21 geïnstalleerd is.
- **Maven**: Voor het beheren van dependencies en bouwen van het project.
- **PostgreSQL** (of een andere SQL-database): Voor het opslaan van gegevens.
- Andere tools: Zorg ervoor dat je een IDE hebt zoals **IntelliJ IDEA Ultimate**.

### 2. Project opzetten
1. Clone de repository:
   ```bash
   git clone <repository_url>
   cd machiavelli-application
   ```
2. Installeer de benodigde dependencies met Maven:
   ```bash
   mvn clean install
   ```
3. Configureer de `application.yml` of `application.properties` file met de juiste instellingen voor de database, Kafka en andere services.

### 3. Database instellen
Voer het volgende SQL-script uit op je database om de benodigde tabellen aan te maken:
- Gebruik Hibernate voor automatische schema-generatie of voeg je eigen SQL-migraties toe via tools zoals Flyway of Liquibase.

### 4. Applicatie starten
Start de applicatie via je IDE of gebruik Maven:
```bash
mvn spring-boot:run
```

---

## 🛠 Functionaliteiten en hoe het werkt
### Kernfunctionaliteiten
- **Spelbeheer**: Logica en beheer van spelers, rondes, en spelacties.
- **Lobbysysteem**: Creëren en beheren van lobbys waar spelers samenkomen.
- **Profielen**: Beheer van gebruiker- en profielinformatie.
- **Notificaties**: E-mail en Discord integratie om gebruikers op de hoogte te houden.
- **Leidersborden**: Hou scores en prestaties bij.

### Technologieën
- **Jakarta EE**: Voor standaard Java EE functionaliteiten.
- **Spring Boot**: Voor snelle ontwikkeling en gemakkelijke configuratie.
- **JPA/Hibernate**: ORM voor database interacties.
- **Kafka**: Voor asynchrone berichtverwerking.
- **Lombok**: Zorgt voor minder boilerplate code.

---

## 📜 Documentatie en bijdragen
Meer gedetailleerde documentatie en richtlijnen zijn te vinden in de `docs/`-map. Zie de volgende bestanden:
- **API Specificatie:** Hier beschrijven we alle beschikbare endpoints.
- **Handleiding voor bijdragen:** Wil je bijdragen aan dit project? Volg de richtlijnen in `CONTRIBUTING.md`.

---

## 👩‍💻 API Endpoints
Een korte samenvatting van belangrijke API's:
- **`GET /api/v1/games`**: Haal alle spellen op.
- **`POST /api/v1/lobby`**: Maak een nieuwe lobby.
- **`GET /api/v1/profile/{id}`**: Haal een specifiek profiel op.
- **`GET /api/v1/leaderboard`**: Bekijk de actuele ranglijst.

Bekijk de Swagger-documentatie voor een volledig overzicht van beschikbare endpoints.

---

## 🧑‍🤝‍🧑 Bijdragen
We verwelkomen bijdragen aan dit project! Bekijk de `CONTRIBUTING.md` file voor richtlijnen over hoe je kunt bijdragen aan de code.

---

## 📞 Support
Heb je vragen of technische problemen? Neem contact op via [support@machiavelli-app.com](mailto:support@machiavelli-app.com) of open een issue in de GitHub-repository.

---

Veel succes! 🎉 Mocht je vragen hebben of hulp nodig hebben, aarzel dan niet om contact op te nemen.