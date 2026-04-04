import React, { useState, useRef } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, NavItem,
    Button, Modal, ModalHeader, ModalBody,
    Offcanvas, OffcanvasHeader, OffcanvasBody,
    Form, FormGroup, Label, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { HonestAILoader } from 'honest-ai-loader';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, signupUser, clearAuthError, clearSignupSuccess, requestPasswordReset, clearResetStatus } from '../redux/auth';
import { setNavOpen } from '../redux/tabs';

function Header() {
    const auth = useSelector(state => state.auth);
    const userPrefs = useSelector(state => state.userPrefs);
    const provider = useSelector(state => state.provider.activeProvider);
    const days = useSelector(state => state.days);
    const dispatch = useDispatch();
    const location = useLocation();

    const isNavOpen = useSelector(state => state.tabs.navOpen);
    const setIsNavOpen = (val) => dispatch(setNavOpen(val));
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoginErrorToShow, setIsLoginErrorToShow] = useState(true);
    const [lastAuthAction, setLastAuthAction] = useState('login');
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const signupUsernameRef = useRef(null);
    const signupPasswordRef = useRef(null);
    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const emailRef = useRef(null);
    const confirmpasswordRef = useRef(null);
    const resetEmailRef = useRef(null);

    const toggleLoginModal = () => {
        dispatch(clearAuthError());
        setIsLoginModalOpen(open => !open);
        setIsLoginErrorToShow(true);
    };

    const toggleLoginErrorModal = () => {
        dispatch(clearAuthError());
        setIsLoginErrorToShow(false);
    };

    const toggleSignupModal = () => {
        setIsSignupModalOpen(open => !open);
    };

    const requestSignupForm = () => {
        setIsSignupModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const handleLogin = (event) => {
        setLastAuthAction('login');
        toggleLoginModal();
        dispatch(loginUser({ username: usernameRef.current.value, password: passwordRef.current.value }));
        event.preventDefault();
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleSignup = (event) => {
        event.preventDefault();
        if (signupPasswordRef.current.value === confirmpasswordRef.current.value) {
            setLastAuthAction('signup');
            toggleSignupModal();
            dispatch(signupUser({ firstname: firstnameRef.current.value, lastname: lastnameRef.current.value, email: emailRef.current.value, username: signupUsernameRef.current.value, password: signupPasswordRef.current.value }));
        } else {
            alert('Le password inserite non coincidono');
        }
    };

    const openResetModal = () => {
        setIsLoginModalOpen(false);
        dispatch(clearResetStatus());
        setIsResetModalOpen(true);
    };

    const handleResetRequest = (event) => {
        event.preventDefault();
        dispatch(requestPasswordReset(resetEmailRef.current.value));
    };

    return (
        <>
        <Navbar dark expand={false} container={false}>
        <div className="container-fluid">
        <NavbarToggler onClick={() => setIsNavOpen(open => !open)} />

        <div className="ms-auto order-md-last d-flex align-items-center gap-3 pe-2">
        {days.isLoading > 0 &&
        <HonestAILoader showText={false} styleOptions={{ size: 24, strokeWidth: 3, primaryColor: '#555555', secondaryColor: 'rgba(255,255,255,0)' }} />
        }
        <span className="fa fa-question-circle fa-lg" style={{color: 'rgba(255,255,255,0.75)', fontSize: '1.4rem', cursor: 'pointer'}} onClick={() => setIsHelpOpen(true)} />
        {auth.isAuthenticated &&
        <Dropdown isOpen={isUserMenuOpen} toggle={() => setIsUserMenuOpen(o => !o)}>
            <DropdownToggle tag="span" style={{color: 'rgba(255,255,255,0.75)', fontSize: '1.4rem', cursor: 'pointer'}}>
                <span className="fa fa-user-circle" />
            </DropdownToggle>
            <DropdownMenu end>
                <DropdownItem header>Ciao {userPrefs.prefs.email}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={NavLink} to="/diary">
                    <span className="fa fa-book me-2" />Diario
                </DropdownItem>
                <DropdownItem tag={NavLink} to="/personalarea">
                    <span className="fa fa-cog me-2" />Area Personale
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                    <span className="fa fa-sign-out me-2" />Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        }
        <NavbarBrand className="m-0 p-0">
        {provider === 'ccb'
            ? <img src='/assets/images/logo-ccb.svg' height="50" alt="CCB" style={{filter: 'brightness(0) invert(1)'}} />
            : provider === 'popup'
            ? <img src='/assets/images/logo-popup.png' height="50" alt="Pop Up Cinema" style={{filter: 'brightness(0) invert(1)'}} />
            : provider === 'galliera'
            ? <img src='/assets/images/logo-galliera.jpg' height="50" alt="Cinema Teatro Galliera" />
            : <img src='/assets/images/logo-white.png' height="50" alt="Calendario Cineteca" />
        }
        </NavbarBrand>
        </div>

        <Offcanvas isOpen={isNavOpen} toggle={() => setIsNavOpen(false)} direction="start" style={{backgroundColor: '#000', color: '#fff'}}>
        <OffcanvasHeader close={<button className="btn-close btn-close-white" onClick={() => setIsNavOpen(false)} />} style={{backgroundColor: '#000'}} />
        <OffcanvasBody>
        <Nav navbar vertical className="offcanvas-nav">
        <NavItem>
        <NavLink className="nav-link" to={`/calendar/${provider}`} onClick={() => setIsNavOpen(false)}>
        <span className="fa fa-calendar fa-lg me-2"></span> Calendario
        </NavLink>
        </NavItem>
        {provider !== 'popup' && provider !== 'galliera' &&
        <NavItem>
        <NavLink className="nav-link" to={`/tracks/${provider}`} onClick={() => setIsNavOpen(false)}>
        <span className="fa fa-film fa-lg me-2"></span> Rassegne
        </NavLink>
        </NavItem>
        }
        <NavItem>
        <NavLink className="nav-link" to="/circuits" onClick={() => setIsNavOpen(false)}>
        <span className="fa fa-rotate fa-lg me-2"></span> Cambia circuito
        </NavLink>
        </NavItem>
        {!auth.isAuthenticated &&
        <NavItem>
        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => { setIsNavOpen(false); toggleLoginModal(); }}>
        <span className="fa fa-sign-in fa-lg me-2"></span> Login
        </span>
        </NavItem>
        }
        </Nav>
        </OffcanvasBody>
        </Offcanvas>
        </div>
        </Navbar>
        <div className='jumbotron'>
        <div className="container">
        <div className="row row-header">
        <div className="col-12 d-flex justify-content-center">
        <h1>
        {provider === 'ccb'
            ? <img src="/assets/images/logo-ccb.svg" height="60" alt="CCB" style={{marginRight: '12px'}} />
            : provider === 'popup'
            ? null
            : provider === 'galliera'
            ? <img src="/assets/images/logo-galliera.jpg" height="60" alt="Cinema Teatro Galliera" style={{marginRight: '12px'}} />
            : <img src="/assets/images/logo-black.png" height="60" alt="Calendario Cineteca" />
        }
        {provider === 'ccb' ? 'Calendario Circuito Cinema Bologna'
            : provider === 'popup' ? 'Calendario Pop Up Cinema'
            : provider === 'galliera' ? 'Calendario Cinema Teatro Galliera'
            : 'Calendario Cineteca di Bologna'
        }
        </h1>
        </div>
        </div>
        </div>
        </div>

        <Modal isOpen={isSignupModalOpen} toggle={toggleSignupModal}>
            <ModalHeader className='modal-header-branded' toggle={toggleSignupModal}>Registrazione</ModalHeader>
            <ModalBody className='pt-3 pb-4 px-4'>
                <Form onSubmit={handleSignup}>
                    <FormGroup>
                        <Label htmlFor="firstname">Nome</Label>
                        <Input type="text" id="firstname" name="firstname" innerRef={firstnameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="lastname">Cognome</Label>
                        <Input type="text" id="lastname" name="lastname" innerRef={lastnameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email" innerRef={emailRef} required />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="signup-username">Username</Label>
                        <Input type="text" id="signup-username" name="username" innerRef={signupUsernameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="signup-password">Password</Label>
                        <Input type="password" id="signup-password" name="password" innerRef={signupPasswordRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="confirmpassword">Conferma password</Label>
                        <Input type="password" id="confirmpassword" name="confirmpassword" innerRef={confirmpasswordRef} />
                    </FormGroup>
                    <div className='mt-3'>
                        <Button className='navigation-button' type="submit">Registrati</Button>
                    </div>
                </Form>
            </ModalBody>
        </Modal>

        <Modal isOpen={isLoginModalOpen} toggle={toggleLoginModal}>
            <ModalHeader className='modal-header-branded' toggle={toggleLoginModal}>Login</ModalHeader>
            <ModalBody className='pt-3 pb-4 px-4'>
                <Form onSubmit={handleLogin}>
                    <FormGroup>
                        <Label htmlFor="username">Username o Email</Label>
                        <Input type="text" id="username" name="username" innerRef={usernameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password" innerRef={passwordRef} />
                    </FormGroup>
                    <div className='d-flex align-items-center mt-3'>
                        <Button className='navigation-button me-3' type="submit">Login</Button>
                        <Button type="button" className='navigation-button' onClick={requestSignupForm}>Registrati</Button>
                    </div>
                    <div className='mt-2'>
                        <span style={{cursor:'pointer', color:'#888', fontSize:'0.9rem'}} onClick={(e) => { e.preventDefault(); openResetModal(); }}>Hai dimenticato la password?</span>
                    </div>
                </Form>
            </ModalBody>
        </Modal>

        <Modal isOpen={isLoginErrorToShow && !auth.isAuthenticated && auth.errMess} toggle={toggleLoginErrorModal}>
            <ModalHeader className='modal-header-branded' toggle={toggleLoginErrorModal}>
                {lastAuthAction === 'signup' ? 'Errore di registrazione' : 'Errore di accesso'}
            </ModalHeader>
            <ModalBody className='pt-3 pb-4 px-4'>
                <p className='mb-0'>{auth.errMess}</p>
            </ModalBody>
        </Modal>

        <Modal isOpen={auth.signupSuccess} toggle={() => dispatch(clearSignupSuccess())}>
            <ModalHeader className='modal-header-branded' toggle={() => dispatch(clearSignupSuccess())}>Registrazione completata</ModalHeader>
            <ModalBody className='pt-3 pb-4 px-4 text-center'>
                <p>Registrazione avvenuta con successo!</p>
                <p>Ora puoi effettuare il login con le tue credenziali.</p>
                <Button className='navigation-button' onClick={() => { dispatch(clearSignupSuccess()); toggleLoginModal(); }}>Vai al login</Button>
            </ModalBody>
        </Modal>

        <Modal isOpen={isHelpOpen} toggle={() => setIsHelpOpen(false)}>
            <ModalHeader className='modal-header-branded' toggle={() => setIsHelpOpen(false)}>
                {location.pathname.startsWith('/movie') ? 'Come usare la scheda film'
                    : location.pathname.startsWith('/tracks') ? 'Come usare le Rassegne'
                    : location.pathname.startsWith('/diary') ? 'Il tuo Diario'
                    : location.pathname.startsWith('/personalarea') ? 'Area Personale'
                    : 'Come usare il calendario'}
            </ModalHeader>
            <ModalBody className='pt-3 pb-4 px-4'>
                {location.pathname.startsWith('/movie') ? <HelpMovie />
                    : location.pathname.startsWith('/tracks') ? <HelpTracks />
                    : location.pathname.startsWith('/diary') ? <HelpPersonalArea />
                    : location.pathname.startsWith('/personalarea') ? <HelpSettings />
                    : <HelpCalendar />
                }
            </ModalBody>
        </Modal>

        <Modal isOpen={isResetModalOpen} toggle={() => setIsResetModalOpen(false)}>
            <ModalHeader className='modal-header-branded' toggle={() => setIsResetModalOpen(false)}>Reset password</ModalHeader>
            <ModalBody className='pt-3 pb-4 px-4'>
                {auth.resetStatus === 'sent'
                    ? <p className='mb-0 text-center'>Controlla la tua email per il link di reset.</p>
                    : <Form onSubmit={handleResetRequest}>
                        <FormGroup>
                            <Label htmlFor="resetemail">Email</Label>
                            <Input type="email" id="resetemail" innerRef={resetEmailRef} required />
                        </FormGroup>
                        {auth.resetErrMess && <p className='text-danger'>{auth.resetErrMess}</p>}
                        <div className='mt-3'>
                            <Button className='navigation-button' type="submit" disabled={auth.isLoading}>
                                {auth.isLoading ? 'Attendi...' : 'Invia link di reset'}
                            </Button>
                        </div>
                    </Form>
                }
            </ModalBody>
        </Modal>
        </>
    );
}

function HelpCalendar() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const provider = useSelector(state => state.provider.activeProvider);
    return (
        <>
            <p>Il <strong>calendario</strong> mostra le proiezioni in programma giorno per giorno.</p>
            <ul className="ps-3">
                <li className="mb-2"><span className="fa fa-chevron-left me-1" /><span className="fa fa-chevron-right me-2" />Naviga tra i giorni con le frecce. Tocca la data al centro per tornare subito a oggi.</li>
                <li className="mb-2"><span className="fa fa-photo-film me-2" />Filtra le proiezioni per sala usando il menu a tendina.</li>
                <li className="mb-2">Clicca sul titolo di un film per aprirne la scheda dettaglio in un nuovo <strong>tab</strong>.</li>
                <li className="mb-2"><span className="fa fa-hand-pointer me-2" />Scorri orizzontalmente per passare tra i tab aperti. Il tab <strong>Calendario</strong> nella barra in fondo è sempre disponibile.</li>
                {provider !== 'popup' && provider !== 'galliera' && (
                    <li className="mb-2"><span className="fa fa-bars me-2" />Usa la voce <strong>Rassegne</strong> nel menu in alto per esplorare i cicli tematici — rimangono nello stesso tab del Calendario.</li>
                )}
                {isAuthenticated && (
                    <li className="mb-2"><span className="fa fa-user-circle me-2" />Il pulsante utente in alto a destra ti permette di accedere al tuo <strong>Diario</strong>, all'<strong>Area Personale</strong> o di effettuare il logout.</li>
                )}
            </ul>
        </>
    );
}

function HelpMovie() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return (
        <>
            <p>La <strong>scheda film</strong> raccoglie tutte le informazioni su un titolo in programma. Si apre in un <strong>tab</strong> — usa la barra in fondo o scorri orizzontalmente per tornare al Calendario senza perdere la posizione.</p>
            <ul className="ps-3">
                <li className="mb-2"><span className="fa fa-calendar me-2" />Il pulsante <strong>Aggiungi al calendario</strong> salva la proiezione nel tuo calendario personale. Se hai impostato un calendario preferito nell'Area Personale, l'evento viene aggiunto direttamente senza mostrare il menu.</li>
                <li className="mb-2"><span className="fa fa-ticket me-2" />Il pulsante <strong>Acquista</strong> apre la pagina di acquisto del biglietto sul sito della Cineteca.</li>
                {isAuthenticated && (<>
                    <li className="mb-2"><span className="fa fa-eye me-2" />Clicca sull'icona occhio per segnare il film come visto e aggiungerlo al tuo <strong>Diario</strong>.</li>
                    <li className="mb-2">Clicca sul <strong>logo del cinema</strong> per aprire la pagina ufficiale della proiezione sul sito del circuito.</li>
                    <li className="mb-2"><strong>IMDb</strong> — se abilitato nell'Area Personale, mostra il voto medio della community di IMDb e il numero di votanti. Clicca sul logo per aprire la scheda ufficiale del film su IMDb.</li>
                    <li className="mb-2"><strong>Letterboxd</strong> — se abilitato nell'Area Personale, mostra il voto medio su Letterboxd. Clicca sul logo per aprire la scheda film su Letterboxd. Se hai impostato il tuo username Letterboxd, un bordo rosso sul logo indica che il film è nella tua watchlist.</li>
                    <li className="mb-2">I pulsanti <strong>Info AI</strong> e <strong>Film simili</strong> generano una scheda sintetica o suggerimenti di film affini tramite intelligenza artificiale.</li>
                </>)}
            </ul>
            {!isAuthenticated && (
                <p className="mt-3 mb-0 text-muted" style={{fontSize: '0.9rem', borderTop: '1px solid #eee', paddingTop: '0.75rem'}}>
                    <span className="fa fa-user-circle me-2" />
                    <strong>Registrandoti</strong> avrai accesso al check-in dei film visti, ai voti IMDb e Letterboxd e al supporto dell'intelligenza artificiale.
                </p>
            )}
        </>
    );
}

function HelpTracks() {
    return (
        <>
            <p>Le <strong>Rassegne</strong> raccolgono cicli tematici di film programmati dalla Cineteca. Si aprono nello stesso tab del Calendario — puoi tornare al programma giornaliero semplicemente toccando <strong>Calendario</strong> nel menu in alto.</p>
            <ul className="ps-3">
                <li className="mb-2">Trovi l'elenco delle rassegne attive, ognuna con immagine, titolo, date e descrizione.</li>
                <li className="mb-2">Clicca sul titolo di una rassegna per vedere tutti i film che la compongono.</li>
                <li className="mb-2">Clicca su un film per aprirne la scheda dettaglio in un nuovo <strong>tab</strong> — scorri orizzontalmente o usa la barra in fondo per tornare alle Rassegne.</li>
            </ul>
        </>
    );
}

function HelpPersonalArea() {
    return (
        <>
            <p>Il <strong>Diario</strong> raccoglie tutti i film che hai segnato come visti.</p>
            <ul className="ps-3">
                <li className="mb-2">Per ogni film trovi il titolo, il voto e il commento che hai inserito.</li>
                <li className="mb-2"><span className="fa fa-edit me-2" />Modifica voto e commento con il pulsante matita.</li>
                <li className="mb-2"><span className="fa fa-trash me-2" />Rimuovi un film dalla lista con il pulsante cestino (viene chiesta conferma).</li>
                <li className="mb-2">Per aggiungere un film al Diario, vai alla sua scheda dettaglio e clicca sull'icona occhio <span className="fa fa-eye ms-1" />.</li>
            </ul>
        </>
    );
}

function HelpSettings() {
    return (
        <>
            <p>L'<strong>Area Personale</strong> ti permette di personalizzare le funzioni del tuo account.</p>
            <ul className="ps-3">
                <li className="mb-2"><strong>IMDb</strong> — abilita o disabilita la visualizzazione del voto IMDb nella scheda film. Quando attivo, il voto medio e il numero di votanti vengono mostrati accanto al logo IMDb.</li>
                <li className="mb-2"><strong>Letterboxd</strong> — abilita o disabilita la visualizzazione del voto Letterboxd nella scheda film.</li>
                <li className="mb-2"><strong>Username Letterboxd</strong> — inserisci il tuo username Letterboxd per attivare il controllo della watchlist: nella scheda film, un bordo rosso sul logo Letterboxd segnala che quel film è nella tua watchlist.</li>
                <li className="mb-2"><strong>Spostati automaticamente sul tab del film</strong> — se attivo (default), aprire un film porta direttamente alla sua scheda. Se disattivo, il tab viene aperto in background e puoi raggiungerlo dalla barra in fondo senza lasciare il Calendario.</li>
                <li className="mb-2"><strong>Calendario preferito</strong> — scegli il calendario su cui salvare le proiezioni (Google, Apple, Outlook…). Se impostato, il pulsante <strong>Aggiungi al calendario</strong> nella scheda film aggiunge l'evento direttamente, senza mostrare il menu di scelta.</li>
                <li className="mb-2"><strong>Cambia password</strong> — invia un link di reset alla tua email per impostare una nuova password.</li>
            </ul>
        </>
    );
}

export default Header;
