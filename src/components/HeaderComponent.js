import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Label, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, signupUser, clearAuthError, clearSignupSuccess, requestPasswordReset, clearResetStatus } from '../redux/auth';

function Header() {
    const auth = useSelector(state => state.auth);
    const provider = useSelector(state => state.provider.activeProvider);
    const days = useSelector(state => state.days);
    const dispatch = useDispatch();

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoginErrorToShow, setIsLoginErrorToShow] = useState(true);
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

    useEffect(() => {
        if (auth.isAuthenticated) {
            dispatch(loginUser({ username: auth.user.username, password: auth.user.password }));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <Navbar dark expand="md">
        <div className="container">
        <NavbarToggler onClick={() => setIsNavOpen(open => !open)} />

        <div className="ml-auto order-md-last d-flex align-items-center">
        {days.isLoading > 0 &&
        <span className="fa fa-spinner fa-pulse fa-lg fa-fw mr-2" style={{color: 'rgba(255,255,255,0.75)'}} />
        }
        {auth.isAuthenticated &&
        <Dropdown isOpen={isUserMenuOpen} toggle={() => setIsUserMenuOpen(o => !o)} className="mr-1">
            <DropdownToggle tag="span" style={{color: 'rgba(255,255,255,0.75)', fontSize: '1.4rem', cursor: 'pointer'}} className="nav-link">
                <span className="fa fa-user-circle" />
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem header>Ciao {auth.user.username}</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={NavLink} to="/personalarea">
                    <span className="fa fa-user-o mr-2" />Area Personale
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                    <span className="fa fa-sign-out mr-2" />Logout
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
        }
        <NavbarBrand tag={NavLink} to="/" className="m-0 p-0">
        {provider === 'ccb'
            ? <img src='/assets/images/logo-ccb.svg' height="50" alt="CCB" style={{filter: 'brightness(0) invert(1)'}} />
            : provider === 'popup'
            ? <img src='/assets/images/logo-popup.png' height="50" alt="Pop Up Cinema" style={{filter: 'brightness(0) invert(1)'}} />
            : <img src='/assets/images/logo-white.png' height="50" alt="Calendario Cineteca" />
        }
        </NavbarBrand>
        </div>

        <Collapse isOpen={isNavOpen} navbar>
        <Nav navbar className="mr-auto">
        <NavItem>
        <NavLink className="nav-link" to={`/calendar/${provider}`}>
        <span className="fa fa-calendar fa-lg"></span> Calendario
        </NavLink>
        </NavItem>
        {provider !== 'popup' &&
        <NavItem>
        <NavLink className="nav-link" to="/tracks">
        <span className="fa fa-film fa-lg"></span> Rassegne
        </NavLink>
        </NavItem>
        }
        {auth.isAuthenticated ?
        <NavItem>
        <NavLink className="nav-link" to="/chat-ai">
        <span className="fa fa-comment fa-lg"></span> Chat AI
        </NavLink>
        </NavItem>
        :
        <NavItem className="nav-link" onClick={toggleLoginModal}>
        <span className="fa fa-sign-in fa-lg"></span> Login
        </NavItem>
        }
        </Nav>
        </Collapse>
        </div>
        </Navbar>
        <Jumbotron className='jumbotron'>
        <div className="container">
        <div className="row row-header">
        <div className="col-12 d-flex justify-content-center">
        <h1>
        {provider === 'ccb'
            ? <img src="/assets/images/logo-ccb.svg" height="60" alt="CCB" style={{marginRight: '12px'}} />
            : provider === 'popup'
            ? null
            : <img src="/assets/images/logo-black.png" height="60" alt="Calendario Cineteca" />
        }
        {provider === 'ccb' ? 'Calendario Circuito Cinema Bologna'
            : provider === 'popup' ? 'Calendario Pop Up Cinema'
            : 'Calendario Cineteca di Bologna'
        }
        </h1>
        </div>
        </div>
        </div>
        </Jumbotron>

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
                        <Button className='navigation-button mr-3' type="submit">Login</Button>
                        <Button type="button" className='navigation-button' onClick={requestSignupForm}>Registrati</Button>
                    </div>
                    <div className='mt-2'>
                        <span style={{cursor:'pointer', color:'#888', fontSize:'0.9rem'}} onClick={(e) => { e.preventDefault(); openResetModal(); }}>Hai dimenticato la password?</span>
                    </div>
                </Form>
            </ModalBody>
        </Modal>

        <Modal isOpen={isLoginErrorToShow && !auth.isAuthenticated && auth.errMess} toggle={toggleLoginErrorModal}>
            <ModalHeader className='modal-header-branded' toggle={toggleLoginErrorModal}>Errore di accesso</ModalHeader>
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

export default Header;
