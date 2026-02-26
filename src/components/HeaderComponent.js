import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, signupUser, clearAuthError } from '../redux/auth';
import { setProvider } from '../redux/provider';

function Header() {
    const auth = useSelector(state => state.auth);
    const provider = useSelector(state => state.provider.activeProvider);
    const dispatch = useDispatch();
    const history = useHistory();

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoginErrorToShow, setIsLoginErrorToShow] = useState(true);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const firstnameRef = useRef(null);
    const lastnameRef = useRef(null);
    const confirmpasswordRef = useRef(null);

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
        if (passwordRef.current.value === confirmpasswordRef.current.value) {
            toggleSignupModal();
            dispatch(signupUser({ firstname: firstnameRef.current.value, lastname: lastnameRef.current.value, username: usernameRef.current.value, password: passwordRef.current.value }));
        } else {
            alert('Le password inserite non coincidono');
        }
        event.preventDefault();
    };

    return (
        <>
        <Navbar dark expand="md">
        <div className="container">
        <NavbarToggler onClick={() => setIsNavOpen(open => !open)} />
        <NavbarBrand className="mr-auto" href="/">
        {provider === 'ccb'
            ? <img src='/assets/images/logo-ccb.svg' height="60" alt="CCB" style={{filter: 'brightness(0) invert(1)'}} />
            : <img src='/assets/images/logo-white.png' height="60" alt="Calendario Cineteca" />
        }
        </NavbarBrand>

        <Collapse isOpen={isNavOpen} navbar>
        <Nav navbar>
        <NavItem>
        <NavLink className="nav-link" to="/home">
        <span className="fa fa-calendar fa-lg"></span> Calendario
        </NavLink>
        </NavItem>
        <NavItem>
        <NavLink className="nav-link" to="/tracks">
        <span className="fa fa-film fa-lg"></span> Rassegne
        </NavLink>
        </NavItem>
        {auth.isAuthenticated ?
        <>
        <NavItem>
        <NavLink className="nav-link" to="/chat-ai">
        <span className="fa fa-comment fa-lg"></span> Chat AI
        </NavLink>
        </NavItem>
        <NavItem>
        <NavLink className="nav-link" to="/personalarea">
        <span className="fa fa-user-o fa-lg"></span> Area Personale
        </NavLink>
        </NavItem>
        <NavItem className="nav-link" onClick={handleLogout}>
        <span className="fa fa-sign-out fa-lg"></span> Logout
        </NavItem>
        </>
        :
        <NavItem className="nav-link" onClick={toggleLoginModal}>
        <span className="fa fa-sign-in fa-lg"></span> Login
        </NavItem>
        }
        </Nav>
        </Collapse>
        {auth.isAuthenticated &&
        <Nav className='ml-2'>
            <NavItem className='nav-link'>
                <span style={{color: 'white'}}>Ciao {auth.user.username}</span>
            </NavItem>
        </Nav>
        }
        <div className='d-flex align-items-center ml-2'>
            <span className='provider-switch-label mr-1'>Cineteca</span>
            <div className='custom-control custom-switch'>
                <input
                    type='checkbox'
                    className='custom-control-input'
                    id='providerSwitch'
                    checked={provider === 'ccb'}
                    onChange={() => {
                        dispatch(setProvider(provider === 'ccb' ? 'cineteca' : 'ccb'));
                        history.push('/calendar');
                    }}
                />
                <label className='custom-control-label provider-switch-label' htmlFor='providerSwitch'>CCB</label>
            </div>
        </div>
        </div>
        </Navbar>
        <Jumbotron className='jumbotron'>
        <div className="container">
        <div className="row row-header">
        <div className="col-12 d-flex justify-content-center">
        <h1>
        {provider === 'ccb'
            ? <img src="/assets/images/logo-ccb.svg" height="60" alt="CCB" style={{marginRight: '12px'}} />
            : <img src="/assets/images/logo-black.png" height="60" alt="Calendario Cineteca" />
        }
        {provider === 'ccb' ? 'Calendario Circuito Cinema Bologna' : 'Calendario Cineteca di Bologna'}
        </h1>
        </div>
        </div>
        </div>
        </Jumbotron>

        <Modal isOpen={isSignupModalOpen} toggle={toggleSignupModal}>
            <ModalHeader className='navigation-button' toggle={toggleSignupModal}>Signup</ModalHeader>
            <ModalBody>
            <div className='white-back row-content'>
            <Form onSubmit={handleSignup}>
                    <FormGroup>
                        <Label htmlFor="firstname">First Name</Label>
                        <Input type="text" id="firstname" name="firstname"
                            innerRef={firstnameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input type="text" id="lastname" name="lastname"
                            innerRef={lastnameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" name="username"
                            innerRef={usernameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password"
                            innerRef={passwordRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="confirmpassword">Confirm Password</Label>
                        <Input type="password" id="confirmpassword" name="confirmpassword"
                            innerRef={confirmpasswordRef} />
                    </FormGroup>
                    <Button className='navigation-button' type="submit" value="Signup" color="primary">Signup</Button>
                </Form>
                </div>
            </ModalBody>
        </Modal>

        <Modal isOpen={isLoginModalOpen} toggle={toggleLoginModal}>
            <ModalHeader className='navigation-button' toggle={toggleLoginModal}>Login</ModalHeader>
            <ModalBody>
            <div className='white-back row-content'>
                <Form onSubmit={handleLogin}>
                    <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" name="username"
                            innerRef={usernameRef} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password"
                            innerRef={passwordRef} />
                    </FormGroup>

                    <Button className='navigation-button mr-4' type="submit" value="Login" color="primary">Login</Button>
                    <Button className='navigation-button' onClick={requestSignupForm}>Signup</Button>
                </Form>
                </div>
            </ModalBody>
        </Modal>

        <Modal isOpen={isLoginErrorToShow && !auth.isAuthenticated && auth.errMess} toggle={toggleLoginErrorModal}>
        <ModalHeader className='navigation-button' toggle={toggleLoginErrorModal}>Login errato</ModalHeader>
            <ModalBody>
                <div className='white-back row-content'>
                    {auth.errMess}
                </div>
            </ModalBody>
        </Modal>
        </>
    );
}

export default Header;
