# Cinetecalendar

Calendario degli spettacoli cinematografici di Bologna.

Circuiti supportati: Cineteca di Bologna, Circuito Cinema Bologna, Pop Up Cinema, Cinema Teatro Galliera.

## Struttura del repository

```
calendario-cineteca/
├── client/    React web app + Android (Capacitor)
├── server/    Cloud Functions (Express / Mongoose)
├── firebase.json
└── CHANGELOG.md
```

Il codice server era precedentemente mantenuto nel repo separato
[sterte/calendario-cineteca-server](https://github.com/sterte/calendario-cineteca-server),
ora archiviato e unificato qui.

## Sviluppo locale

```bash
# client
cd client
npm install --legacy-peer-deps
npm start
```

## Build e deploy

```bash
# dalla root del repo
cd client && npm run build && cd ..
firebase deploy --only hosting --force   # solo client
firebase deploy --only functions --force # solo server
firebase deploy --force                  # entrambi
```

## App mobile (Android)

La build Android viene prodotta automaticamente da GitHub Actions a ogni push di tag `v*`
oppure manualmente dal tab Actions del repo.

Il `.aab` firmato viene caricato su Google Play Console (traccia Internal Testing).
