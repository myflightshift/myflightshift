MyFlightShift 2.2 – Installation und Aktualisierung (19.11.2026)

GitHub Pages (empfohlen):
1. ZIP auf deinem Computer ENTpacken.
2. GitHub-Repository myflightshift/myflightshift öffnen > Add file > Upload files.
3. ALLE Dateien UND Ordner aus dem entpackten Verzeichnis hochladen (nicht die ZIP selbst).
4. Commit changes. GitHub Pages veröffentlicht automatisch vom Branch main / (root).
5. Nach dem Deployment https://myflightshift.github.io/myflightshift/ aufrufen.
6. Bei bestehender installierter PWA neu öffnen; bei veralteter Ansicht Website aktualisieren.

ALL-INKL (nur wenn weiterhin separat verwendet): Dateien und Unterordner in den tatsächlichen Web-Root hochladen. GitHub Pages und ALL-INKL sind getrennte Veröffentlichungswege.

Installation auf Geräten:
iPhone/iPad: HTTPS-Seite in Safari öffnen > Teilen > Zum Home-Bildschirm > Hinzufügen (ggf. Als Web-App öffnen).
Android: HTTPS-Seite in Chrome öffnen > Menü > App installieren / Zum Startbildschirm hinzufügen.
Windows/macOS: HTTPS-Seite in Edge/Chrome öffnen > App installieren im Browsermenü.
Eine automatische Installation ohne Zustimmung ist nicht möglich.

NEU: App-Icon Vorschlag 2, Website-Logo Vorschlag 3, Counter-Auswahl nach Terminal, freies Gate-Feld, responsive Eingabemaske, Destination in Großbuchstaben, Pflichtfeld-Sterne, Agent(s), Impressum.

DATEN: Die bestehende lokale Speicherung bleibt erhalten (Schlüssel flightdesk-flights-v1). Vor Updates empfiehlt sich ein JSON-Backup. Bestehende Flüge werden beim Update nicht absichtlich gelöscht. Ein Wechsel der Domain (github.io -> myflightshift.at) überträgt lokale Flüge NICHT automatisch; bitte vorher Backup exportieren und auf neuer Domain importieren.

HINWEIS: Bitte vor produktiver Nutzung sämtliche Funktionen auf Mobilgeräten testen. Impressum mit vollständiger ladungsfähiger Anschrift und datenschutzrechtliche Angaben ggf. rechtlich prüfen. Die Markenrechte an fremden Airline-Logos bleiben gesondert zu klären.

NEU in 1.9: Terminal 1 Counter 162–168 als eigene Gruppe „Terminal 1 · 162–168“; Start, Ende und STD verkürzte Labels; Gate/Position; Großschreibung von Buchstaben in Flugnummer, Destination, Gate/Position, Flugzeugtyp und Agent(s) (Zahlen/Sonderzeichen unverändert); mobile Eingabefelder mit mindestens 16px gegen iPhone-Fokuszoom; Zoom-Gesten im Viewport deaktiviert. Hinweis: Deaktivierter manueller Zoom schränkt Barrierefreiheit ein.

NEU in 2.0: Im Auswahlfeld Terminal / Counter zusätzliche Einträge T1, T3, 151-162, 335-338, 111-118, T1A, Charter, Inc, UM, ServiceDesk. Die bisherigen nummerischen Counter bleiben erhalten.

NEU in 2.1: Optionales Uhrzeitfeld GTE unmittelbar nach STD. GTE wird mit Flügen und JSON-Backups gespeichert und auf den Flugkarten angezeigt. Alte Einträge ohne GTE bleiben gültig.

NEU in 2.2: Das optionale Uhrzeitfeld nach STD heißt jetzt „Gate (Uhrzeit)“ statt „GTE“. Das separate Feld „Gate/Position“ bleibt unverändert.

Version 2.3: iPhone-Dialog auf Bildschirmbreite begrenzt, Eingabefelder einspaltig, horizontales Scrollen verhindert; Schriftgroesse 16px; Zoom-Sperre entfernt.

Version 2.4: Mobilansicht „Flug hinzufügen“ als Vollbild-Tab, kompakte Felder, keine horizontale Verschiebung; Start/Ende/STD/Gate-Uhrzeit zweispaltig.
