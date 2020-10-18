# Socket.IO simple chat server
## Stack
- NodeJS+Express+Socket.IO
- jQuery, UIKit

## Server
**_/.env/**
- env nach .env kopieren und ggf. anpassen

**_/app.js**
- Übergibt den Socket für Socket.IO als Handlebars expression. *( Zeile 22 )*
- Verarbeitet Messages der Clients. *( Zeile 30ff )*.
  Hier wird nur der gesendete Messagetext an alle Clients versendet ( emit ).
- Kann auch unabhängig von Anfragen Messages an die Clients schicken.

## Client
**_/views/chat.handlebars**
- Verbindung mit dem Server herstellen *( Zeile 28 )*.
- Events *( Zeile 47 und 54 )* lösen das Senden vom Inhalt der Inputzeile *( Zeile 54ff )* aus.


