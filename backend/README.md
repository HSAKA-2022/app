# Einleitung

Das Backend baut auf einem einfachem `Koa` Server auf, und ermöglicht es den `State` der einzelnen `Riddles` zu verwalten.

## Running

1. Dependencies instalieren mit `npm install`
2. Server starten mit `npm run start`
3. Der Server läuft jetzt auf `http://localhost:5000`

## Funktionsweise

Jedes `Riddle` bekommt eine eigene sub-url.
Also zB `https://backend.burg.games/rgb`.
Alle weiteren funktionen befinden sich immer unter dieser url.

### GET-ing the state

Jedes Handy kann sich seinen eigenen State immer direkt unter der `Riddle`-url abrufen.
(also zb `GET https://backend.burg.games/rgb).
Wie wir Spieler auseinanderhalten erfährst du in (#Authorization)

### Aktionen

Es gibt in unserem system 2 arten von Aktionen.
`Handy` und `Pi` Actions.

`Handy` aktionen werden von einem Spieler auf seimen Handy ausgeführt.
`Pi` aktionen sind interaktionen aus er Echten Welt, und werden daher von einem Pi gehandelt.

#### Handy

Um eine Aktion von einem Handy auszuführen, POST-ed das Handy zu einer bestimmten aktions-url.
Dabei kann es informationen (die der Spieler eingegeben hat) mit angeben.

Zb.: `POST https://backend.burg.games/rgb/setColor` mit `{"value": 175}`.
Der Server ruft dann in dem `handyActions` Object die Funktion `setColor` auf.

#### PI

Um eine Aktion von einem Pi auszuführen, POST-ed das Pi zu einer bestimmten aktions-url.
Beachte, das PI's nicht zu einem Spieler gebunden sind (wir wissen eben nicht wer den knopf gedrückt hat!)

Zb.: `POST https://backend.burg.games/rgb/pressButton` mit `{"button": 2}`.
Der Server ruft dann in dem `piActions` Object die Funktion `pressButton` auf.

### Authorization

Jeder Spieler bekommt auf seinem Handy eine zufällige ID zugewiesen.
Der Server nutzt diese um ihn zu authentifizieren.

### Wie schreibt man ein `Riddle` ?

1. Neues File im Ordner `/riddles`
2. Die `riddle()` Funktion aus `riddle.ts` importieren und aufrufen
3. Die logic in die Argumente einbauen (siehe Beispiele und in `riddle.ts` für mehr Erklärungen)
