import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
	Button, Modal, ModalHeader, ModalBody,
	Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';


class Header extends Component{

    constructor(props) {
        super(props);        
        this.state = {
            isNavOpen: false,        
            isLoginModalOpen: false,
            isLoginErrorToShow: true,
            isSignupModalOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);   
        this.toggleSignupModal = this.toggleSignupModal.bind(this);     
        this.toggleLoginModal = this.toggleLoginModal.bind(this);     
        this.toggleLoginErrorModal = this.toggleLoginErrorModal.bind(this);     
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.requestSignupForm = this.requestSignupForm.bind(this);
    }

    
    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.loginUser({username: this.props.auth.user.username, password: this.props.auth.user.password});
        }
    }            


    toggleNav() {
        this.setState({isNavOpen: !this.state.isNavOpen});
    }

    requestSignupForm() {
        this.setState({isSignupModalOpen: true, isLoginModalOpen: false});
    }

    toggleSignupModal() {
        this.setState({isSignupModalOpen: !this.state.isSignupModalOpen});
    }

    toggleLoginModal() {
        this.setState({isLoginModalOpen: !this.state.isLoginModalOpen, isLoginErrorToShow: true});
    }

    toggleLoginErrorModal() {
        this.props.auth.errMess = '';
        this.setState({isLoginErrorToShow: !this.state.isLoginErrorToShow});
    }

    handleLogin(event) {
        this.toggleLoginModal();
        this.props.loginUser({username: this.username.value, password: this.password.value});
        event.preventDefault();
    }

    handleLogout() {
        this.props.logoutUser();
    }

    handleSignup(event){
        if(this.password.value === this.confirmpassword.value){        
            this.toggleSignupModal();
            this.props.signupUser({firstname: this.firstname.value, lastname: this.lastname.value, username: this.username.value, password: this.password.value});                                    
        }
        else{
            alert('Le password inserite non coincidono');            
        }     
        event.preventDefault();   
    }

    render(){       
        return(
            <>
            <Navbar dark expand="md">
            <div className="container">
            <NavbarToggler onClick={this.toggleNav} />
            <NavbarBrand className="mr-auto" href="/">
            <img src='/assets/images/logo-white.png' height="60" alt="Calendario Cineteca" />
            </NavbarBrand>
            
            <Collapse isOpen={this.state.isNavOpen} navbar>
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
            {this.props.auth.isAuthenticated ?
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
            <NavItem className="nav-link" onClick={this.handleLogout}>            
            <span className="fa fa-sign-out fa-lg"></span> Logout            
            </NavItem>                
            </>
            :            
            <NavItem className="nav-link" onClick={this.toggleLoginModal}>            
            <span className="fa fa-sign-in fa-lg"></span> Login            
            </NavItem>                
            }                        
            </Nav>
            </Collapse>
            {this.props.auth.isAuthenticated &&
            <Nav className='ml-auto'>
                <NavItem className='nav-link'>                    
                    <span style={{color: 'white'}}>Ciao {this.props.auth.user.username}</span>
                </NavItem>
            </Nav>
            }
            </div>
            </Navbar>
            <Jumbotron className='jumbotron'>
            <div className="container">
            <div className="row row-header">
            <div className="col-12 d-flex justify-content-center">                        
            <h1><img src="/assets/images/logo-black.png" height="60" alt="Calendario Cineteca" /> 
            Calendario Cineteca di Bologna</h1>
            </div>
            </div>
            </div>
            </Jumbotron>


            <Modal isOpen={this.state.isSignupModalOpen} toggle={this.toggleSignupModal}>
                    <ModalHeader className='navigation-button' toggle={this.toggleSignupModal}>Signup</ModalHeader>
                    <ModalBody>
                    <div className='white-back row-content' >
                    <Form onSubmit={this.handleSignup}>
                            <FormGroup>
                                <Label htmlFor="firstname">First Name</Label>
                                <Input type="text" id="firstname" name="firstname"
                                    innerRef={(input) => this.firstname = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input type="text" id="lastname" name="lastname"
                                    innerRef={(input) => this.lastname = input} />
                            </FormGroup>                            
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="confirmpassword">Confirm Password</Label>
                                <Input type="password" id="confirmpassword" name="confirmpassword"
                                    innerRef={(input) => this.confirmpassword = input}  />
                            </FormGroup>                            
                            <Button className='navigation-button' type="submit" value="Signup" color="primary">Signup</Button>
                        </Form>
                        </div>
                        </ModalBody>
                </Modal>

            <Modal isOpen={this.state.isLoginModalOpen} toggle={this.toggleLoginModal}>
                    <ModalHeader className='navigation-button' toggle={this.toggleLoginModal}>Login</ModalHeader>
                    <ModalBody>
                    <div className='white-back row-content' >
                        <Form onSubmit={this.handleLogin}>
                            <FormGroup>
                                <Label htmlFor="username">Username</Label>
                                <Input type="text" id="username" name="username"
                                    innerRef={(input) => this.username = input} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="password">Password</Label>
                                <Input type="password" id="password" name="password"
                                    innerRef={(input) => this.password = input}  />
                            </FormGroup>
                            
                            <Button className='navigation-button mr-4'type="submit" value="Login" color="primary">Login</Button>                            
                            <Button className='navigation-button' onClick={this.toggleSignupModal}>Signup</Button>	                        
                        </Form>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.isLoginErrorToShow && !this.props.auth.isAuthenticated && this.props.auth.errMess} toggle={this.toggleLoginErrorModal}>                
                <ModalHeader className='navigation-button' toggle={this.toggleLoginErrorModal}>Login errato</ModalHeader>
                    <ModalBody>
                        <div className='white-back row-content' >
                            {this.props.auth.errMess}
                        </div>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}

export default Header;