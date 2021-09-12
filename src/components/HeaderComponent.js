import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
	Button, Modal, ModalHeader, ModalBody,
	Form, FormGroup, Label, Input } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { fetchUrl } from '../shared/baseUrl';

class Header extends Component{

    constructor(props) {
        super(props);        
        this.state = {
            isNavOpen: false,        
            isLoginModalOpen: false,
            isSignupModalOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);   
        this.toggleSignupModal = this.toggleSignupModal.bind(this);     
        this.toggleLoginModal = this.toggleLoginModal.bind(this);     
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.requestSignupForm = this.requestSignupForm.bind(this);
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
        this.setState({isLoginModalOpen: !this.state.isLoginModalOpen});
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
            alert('Passwords do not match');            
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
            <img src={fetchUrl + "/images/logo.png"} height="60" alt="Calendario Cineteca" />
            </NavbarBrand>
            
            <Collapse isOpen={this.state.isNavOpen} navbar>
            <Nav navbar>
            <NavItem>
            <NavLink className="nav-link" to="/home">
            <span className="fa fa-home fa-lg"></span> Home
            </NavLink>
            </NavItem>            
            <NavItem>
            <NavLink className="nav-link" to="/personalarea">
            <span className="fa fa-list fa-lg"></span> Personal Area
            </NavLink>
            </NavItem>            
            </Nav>
            <Nav className="ml-auto">
            <NavItem>
            { !this.props.auth.isAuthenticated ?
            <Button outline onClick={this.toggleLoginModal}>
            <span className="fa fa-sign-in fa-lg"></span> Login
            </Button>			
            :
            <Button outline onClick={this.handleLogout}>
            <span className="fa fa-sign-in fa-lg"></span> Logout
            </Button>			
            }            
            </NavItem>
            </Nav>
            </Collapse>
            </div>
            </Navbar>
            <Jumbotron className='jumbotron'>
            <div className="container">
            <div className="row row-header">
            <div className="col-12 d-flex justify-content-center">                        
            <h1><img src={fetchUrl + "/images/logo.png"} height="60" alt="Calendario Cineteca" /> 
            Calendario Cineteca di Bologna</h1>
            </div>
            </div>
            </div>
            </Jumbotron>


            <Modal isOpen={this.state.isSignupModalOpen} toggle={this.toggleSignupModal}>
                    <ModalHeader toggle={this.toggleSignupModal}>Signup</ModalHeader>
                    <ModalBody>
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
                            <Button type="submit" value="Signup" color="primary">Signup</Button>
                        </Form>
                        </ModalBody>
                </Modal>

            <Modal isOpen={this.state.isLoginModalOpen} toggle={this.toggleLoginModal}>
                    <ModalHeader toggle={this.toggleLoginModal}>Login</ModalHeader>
                    <ModalBody>
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
                            <div className="row">
                            <div className="col-2 d-flex">  
                            <Button type="submit" value="Login" color="primary">
                                <span className="fa fa-sign-in fa-lg"> Login</span>
                            </Button>
                            </div>
                            <div className="col-2 d-flex">  
                            <Button onClick={this.toggleSignupModal}>
                                <span className="fa fa-sign-in fa-lg" color="primary"> Signup</span>
                            </Button>	
                            </div>
                            </div>
                        </Form>
                    </ModalBody>
                </Modal>

            </>
        );
    }
}

export default Header;