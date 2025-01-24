# Projectnaam

Welkom bij dit project! Dit document legt uit hoe de verschillende onderdelen van het project werken, hoe je het installeert en draait, en geeft een overzicht van de belangrijkste mappen/functionaliteiten.

---

## Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Installatie](#installatie)
3. [Projectstructuur](#projectstructuur)
4. [Functionele Overzicht](#functionele-overzicht)
5. [Belangrijke Contexts en Hooks](#belangrijke-contexts-en-hooks)
6. [Vertalingen](#vertalingen)
7. [Technologieën](#technologieën)
8. [Contact & Bijdragen](#contact-en-bijdragen)

---

## Overzicht

Dit project is een webapplicatie voor een interactief spel waarbij gebruikers kunnen deelnemen aan verschillende activiteiten zoals:
- Het kiezen van een karakter.
- Een game lobby joinen of een nieuwe game starten.
- Spelersprofielen beheren.
- Competitieve scoreborden en toernooien bekijken.

De applicatie is gebouwd met behulp van **React (TypeScript)** en gebruikt **npm** als pakketmanager.

---

## Installatie

Volg deze stappen om het project lokaal uit te voeren:

### Stap 1: Vereisten
- [Node.js](https://nodejs.org/) - Zorg ervoor dat Node.js is geïnstalleerd.
- npm (komt standaard met Node.js).

### Stap 2: Repository klonen
Kloon de repository naar je lokale machine:
```bash
git clone <repository-url>
```

### Stap 3: Dependencies installeren
Navigeer naar de projectmap en installeer alle benodigde dependencies:
```bash
npm install
```

### Stap 4: Applicatie draaien
Start de applicatie in dev-modus:
```bash
npm run dev
```
De applicatie is nu bereikbaar op `http://localhost:3000`.

---

## Projectstructuur

Hier is een overzicht van de belangrijkste mappen en bestanden:



---

## Functionele Overzicht

### Belangrijkste Pagina's
- **AdminPage**: Voor beheerderstaken zoals schema's beheren en voorspellingen maken.
- **GamePage**: Bevat alle logica en UI voor het gameplay-scherm.
- **LobbyPage**: Hiermee kan een gebruiker een game lobby creëren, bekijken en/of joinen.
- **LeaderboardPage**: Overzicht van beste spelers en prestaties.
- **HomePage**: Landingpagina van de applicatie.
- **NotFoundPage**: Vangt ongeldige routes op (404).

---

## Belangrijke Contexts en Hooks

**Contexts:**
1. **SecurityContext**: Behandelt authenticatie en beveiliging.
2. **GameContext**: Houdt de huidige game-status bij zoals rondes, spelers, en timing.
3. **LobbyContext**: Houdt gegevens bij over actieve spel-lobby’s.
4. **AvatarContext**: Behandelt avatar-instellingen van gebruikers.

**Hoofd-hooks:**
- `useGameContext()`: Toegang tot huidige game-informatie.
- `useProfile()`: Toegang tot gebruikersprofielinformatie.
- `useLeaderboard()`: Fetch en beheer leaderboard-gegevens.
- `useLobbyActions()`: Functies om te handelen in lobby-items.
- `useCharacterActions()`: Interactie van gebruiker met hun karakter.

---

## Vertalingen

Vertalingen zijn opgeslagen in `src/locales/` en onderverdeeld in taalgebieden:
- Engels (`en/translations.json`)
- Wit-Russisch (`be/translations.json`)

Gebruik `react-i18next` om gemakkelijk teksten te internationaliseren.

---

## Technologieën

Hier is een lijst van de belangrijkste technologieën en pakketten die in het project worden gebruikt:

### Frontend
- **React 18.3.1** met **TypeScript 5.6.2**.
- **@mui/material**: Voor Material UI-componenten.
- **@tanstack/react-query**: Voor gegevensbeheer en serverstaat.
- **zustand**: Voor state management binnen de applicatie.
- **i18next** en **react-i18next**: Voor meertalige ondersteuning.

### Backend/Services
- **Axios**: Voor het maken van API-aanroepen.
- **json-server** (voor dev): Mock-backend voor snelle ontwikkeling.

### Testing
- **@testing-library/react**: Voor component- en integratietesten.
- **Vitest 2.1.8**: Voor unit testing.

---

## Contact en Bijdragen

### Contact
Als je vragen hebt of hulp nodig hebt, neem contact op met ons team via:
- Email: [contact@projectnaam.nl](mailto:contact@projectnaam.nl)
- Slack: [#projectnaam-support](https://projectnaam.slack.com/)

### Bijdragen
We verwelkomen bijdragen aan dit project! Om bij te dragen:
1. Fork de repository.
2. Maak een feature branch: `git checkout -b mijn-feature`.
3. Maak een pull request met een beschrijving van je wijzigingen.

---

Bedankt dat je dit project gebruikt! 😊