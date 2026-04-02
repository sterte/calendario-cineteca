# Cinetecalendar

Calendario degli spettacoli cinematografici di Bologna.

Circuiti supportati: Cineteca di Bologna, Circuito Cinema Bologna, Pop Up Cinema, Cinema Teatro Galliera.

## Sviluppo locale

```bash
npm install --legacy-peer-deps
npm start
```

## Build e deploy

```bash
npm run build
firebase deploy --only hosting --force
```

## App mobile (Android)

La build Android viene prodotta automaticamente da GitHub Actions a ogni push di tag `v*`
oppure manualmente dal tab Actions del repo.

Il `.aab` firmato viene caricato su Google Play Console (traccia Internal Testing).

Vedi `MOBILE_APP.md` per la documentazione completa del processo.
