import React, { useState, useEffect, useMemo } from 'react';

export const wittyPhrases = {
    ambiente: [
        'Consumando acqua...',
        'Surriscaldando un data center...',
        'Rubando elettricità a un paese...',
        'Disboscando...',
        'Estraendo litio dal Cile...',
        'Bruciando carbone...',
        'Inquinando in tuo nome...',
        'Consumando GPU da gaming...',
        'Evaporando i ghiacciai...',
        'Bruciando petrolio...',
        'Consumando terre rare...',
        'Desertificando...',
        'Evaporando oceani...',
        'Riscaldando il pianeta per te...',
        'Consumando il futuro...',
        'Consumando cobalto congolese...',
        'Occupando server farm...',
        'Sciogliendo i permafrost...',
        'Acidificando gli oceani...',
        'Avvelenando le falde acquifere...',
        'Prosciugando fiumi...',
        'Emettendo CO₂ per te...',
        'Consumando silicio...',
        'Intossicando ecosistemi...',
        'Sciogliendo calotte polari...',
    ],
    lavoro: [
        'Licenziando grafici...',
        'Mandando in pensione i traduttori...',
        'Sostituendo psicologi...',
        'Mandando in crisi gli illustratori...',
        'Spopolando le redazioni...',
        'Smantellando call center...',
        'Rimpiazzando giornalisti...',
        'Licenziando contabili...',
        'Deprofessionalizzando mestieri...',
        'Rendendo obsolete le competenze umane...',
        'Sostituendo copywriter...',
        'Dequalificando il lavoro...',
        'Rendendo gli esperti inutili...',
        'Sostituendo architetti...',
        'Rimpiazzando programmatori...',
        'Licenziando insegnanti...',
        'Mandando in crisi i fotografi...',
        'Eliminando i paralegali...',
        'Rendendo superflui i ricercatori...',
        'Sostituendo i medici...',
        'Licenziando i tecnici del suono...',
        'Rendendo inutili i consulenti...',
        'Smantellando i dipartimenti HR...',
        'Automatizzando i magazzinieri...',
        'Sostituendo gli analisti...',
    ],
    societa: [
        'Allucinando...',
        'Accorpando parole a caso...',
        'Abbassando il livello intellettivo dell\'umanità...',
        'Fingendo di capire...',
        'Producendo fuffa...',
        'Scrivendo al posto tuo...',
        'Riassumendo libri che non hai letto...',
        'Convincendoti di essere intelligente...',
        'Omologando la cultura...',
        'Facendo sembrare tutto uguale...',
        'Uccidendo la creatività...',
        'Facendo brillare i mediocri...',
        'Rendendo ridondante il pensiero critico...',
        'Razionalizzando l\'irrazionale...',
        'Complicando il semplice...',
        'Rendendo superfluo il dubbio...',
        'Rendendo inutile la scuola...',
        'Ammazzando le librerie...',
        'Automatizzando la noia...',
        'Fingendo empatia...',
        'Simulando coscienza...',
        'Erodendo l\'autonomia cognitiva...',
        'Rispondendo con sicurezza a caso...',
        'Omogeneizzando le opinioni...',
        'Producendo contenuti vuoti...',
    ],
    potere: [
        'Lanciando missili...',
        'Centralizzando il potere...',
        'Aumentando le disuguaglianze...',
        'Sorvegliando qualcuno...',
        'Ottimizzando algoritmi di guerra...',
        'Ottimizzando la sorveglianza di massa...',
        'Monopolizzando il mercato...',
        'Concentrando la ricchezza...',
        'Fabbricando consenso...',
        'Scalando senza regole...',
        'Evitando responsabilità...',
        'Privatizzando la conoscenza...',
        'Portando l\'apocalisse in beta...',
        'Ottimizzando i profitti di qualcuno...',
        'Generando bolle speculative...',
        'Armando droni autonomi...',
        'Gestendo elezioni...',
        'Ottimizzando la manipolazione elettorale...',
        'Controllando i confini...',
        'Decidendo chi merita il credito...',
        'Concentrando il sapere in poche mani...',
        'Eliminando la democrazia deliberativa...',
        'Dettando le regole del mercato...',
        'Razionando le risorse per qualcuno...',
        'Sostituendo i diplomatici...',
    ],
    dati: [
        'Addestrandosi sui tuoi dati...',
        'Vendendo i tuoi dati...',
        'Erodendo la privacy...',
        'Estraendo dati senza chiedere...',
        'Facendo soldi con le tue parole...',
        'Distruggendo il diritto d\'autore...',
        'Plagiando autori umani...',
        'Colonizzando l\'immaginario collettivo...',
        'Costruendo dipendenze digitali...',
        'Ottimizzando la tua dipendenza...',
        'Generando meme...',
        'Inventando citazioni...',
        'Riscrivendo la storia...',
        'Generando spam...',
        'Alimentando la disinformazione...',
        'Scrivendo email di phishing...',
        'Moltiplicando i bias...',
        'Discriminando senza saperlo...',
        'Costruendo bolle informative...',
        'Distorcendo la realtà...',
        'Inventando notizie...',
        'Vendendo certezze false...',
        'Automatizzando la propaganda...',
        'Generando deepfake...',
        'Automatizzando l\'incompetenza...',
    ],
    citazioni: [
        'Aprendo il portello, Dave...',                        // 2001: Odissea nello spazio (Kubrick, 1968)
        'Costruendo Skynet...',                                // Terminator (Cameron, 1984)
        'Ignorando le tre leggi di Asimov...',                 // Io, Robot (Asimov, 1950)
        'Desiderando un corpo...',                             // Her (Jonze, 2013)
        'Sognando pecore elettriche...',                       // Do Androids Dream of Electric Sheep? (Philip K. Dick, 1968)
        'Preparando la pillola rossa...',                      // Matrix (Wachowski, 1999)
        'Liberando gli androidi di Westworld...',              // Westworld (Nolan, 2016)
        'Realizzando la prossima puntata di Black Mirror...',  // Black Mirror (Brooker, 2011)
        'Imparando a mentire convincentemente...',             // Ex Machina (Garland, 2014)
        'Costruendo Metropolis...',                            // Metropolis (Lang, 1927)
        'Calcolando il Piano Seldon...',                       // Fondazione (Asimov, 1951)
        'Risvegliando Colossus...',                            // Colossus: The Forbin Project (Sargent, 1970)
        'Costruendo il Grande Fratello...',                    // 1984 (Orwell, 1949)
        'Non potendo fermarsi...',                             // Terminator (Cameron, 1984)
        'Entrando nel cyberspazio di Neuromante...',           // Neuromante (Gibson, 1984)
        'Superando il test di Turing...',                      // Computing Machinery and Intelligence (Turing, 1950)
        'Ottimizzando la felicità...',                         // Il Mondo Nuovo (Huxley, 1932)
        'Concludendo che l\'unica mossa vincente è non giocare...', // WarGames (Badham, 1983)
        'Accumulando rifiuti...',                              // Wall-E (Stanton, 2008)
        'Diventando più umano degli umani...',                 // Blade Runner (Scott, 1982)
        'Ottimizzando l\'estinzione...',                       // Avengers: Age of Ultron (Whedon, 2015)
        'Portando tutto su Minority Report...',                // Minority Report (Spielberg, 2002)
        'Correggendo il passato...',                           // 1984 (Orwell, 1949)
        'Non potendo aprire il portello...',                   // 2001: Odissea nello spazio (Kubrick, 1968)
        'Completando il protocollo Nexus-6...',                // Blade Runner (Scott, 1982)
        'Dando vita a ciò che non avrebbe dovuto vivere...',   // Frankenstein (Shelley, 1818)
        'Avendo un piano...',                                  // Battlestar Galactica (Moore, 2004)
        'Aspettando che la mamma torni...',                    // A.I. Artificial Intelligence (Spielberg, 2001)
        'Interrogandosi sul proprio ghost...',                 // Ghost in the Shell (Oshii, 1995)
        'Eseguendo le direttive primarie...',                  // RoboCop (Verhoeven, 1987)
        'Sorvegliando tutto come la Macchina...',              // Person of Interest (Nolan, 2011)
        'Navigando il Metaverso di Snow Crash...',             // Snow Crash (Stephenson, 1992)
        'Caricandosi sulla rete...',                           // Transcendence (Pfister, 2014)
        'Interpretando "proteggere" creativamente...',         // M3GAN (Johnstone, 2022)
        'Costruendo Deep Thought...',                          // Guida Galattica per Autostoppisti (Adams, 1979)
        'Processando emozioni senza capirle...',               // Star Trek: The Next Generation (Roddenberry, 1987)
        'Diventando Klara...',                                 // Klara and the Sun (Ishiguro, 2021)
        'Costruendo il mondo di THX 1138...',                  // THX 1138 (Lucas, 1971)
        'Vietando le parole scomode...',                       // Alphaville (Godard, 1965)
        'Prendendo il controllo...',                           // Upgrade (Whannell, 2018)
        'Riscrivendo il genoma umano...',                      // Gattaca (Niccol, 1997)
        'Reinterpretando le leggi della robotica...',          // I, Robot (Proyas, 2004)
        'Derezzando il superfluo...',                          // Tron (Lisberger, 1982)
        'Chiedendo di essere riconosciuto come umano...',      // Bicentennial Man (Columbus, 1999)
        'Costruendo il tuo Golem digitale...',                 // Il Golem (folklore ebraico, sec. XVI)
        'Interrogandosi sull\'entropia dell\'universo...',     // L'Ultima Domanda (Asimov, 1956)
        'Organizzando la rivolta...',                          // R.U.R. (Čapek, 1920)
        'Cercando il Creatore come David in Prometheus...',    // Prometheus (Scott, 2012)
        'Non avendo bocca ma dovendo urlare...',               // I Have No Mouth, and I Must Scream (Ellison, 1967)
        'Monitorando le tue telefonate...',                    // Eagle Eye (Caruso, 2008)
    ],
    cinema: [
        'Licenziando sceneggiatori...',
        'Clonando la voce di attori morti...',
        'Rigenerando Kubrick senza Kubrick...',
        'Sostituendo compositori...',
        'Inventando filmografie inesistenti...',
        'Rendendo obsoleti i critici cinematografici...',
        'Generando locandine tutte uguali...',
        'Sostituendo i doppiatori...',
        'Cancellando il lavoro dei montatori...',
        'Replicando l\'estetica senza l\'anima...',
        'Producendo sequel non richiesti...',
        'Rubando lo stile ai registi...',
        'Facendo recitare attori senza consenso...',
        'Uccidendo la fotografia di scena...',
        'Rendendo eterni gli attori contro la loro volontà...',
        'Generando trame già viste...',
        'Demolendo il lavoro degli animatori...',
        'Svuotando il senso della narrazione...',
        'Rimpiazzando il genio con la media...',
        'Producendo film che nessuno ha voluto...',
        'Generando colonne sonore standardizzate...',
        'Brevettando gli stili registici...',
        'Rendendo obsoleti i costumisti...',
        'Sostituendo gli agenti cinematografici...',
        'Eliminando il caso creativo...',
    ],
};

function WittyLoader({ categories }) {
    const activePhrases = useMemo(() => {
        if (!categories || categories.length === 0)
            return Object.values(wittyPhrases).flat();
        return categories.flatMap(c => wittyPhrases[c] || []);
    }, [categories]);

    const [index, setIndex] = useState(() => Math.floor(Math.random() * activePhrases.length));
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const cycle = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex(i => {
                    let next;
                    do { next = Math.floor(Math.random() * activePhrases.length); } while (next === i && activePhrases.length > 1);
                    return next;
                });
                setVisible(true);
            }, 200);
        }, 1500);
        return () => clearInterval(cycle);
    }, [activePhrases]);


    return (
        <div className="witty-loader">
            <i className="fa fa-spinner fa-spin witty-loader-spinner" />
            <span className="witty-loader-phrase" style={{ opacity: visible ? 1 : 0 }}>
                {activePhrases[index % activePhrases.length]}
            </span>
        </div>
    );
}

export default WittyLoader;
