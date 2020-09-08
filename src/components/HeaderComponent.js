import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';

class Header extends Component{

    constructor(props) {
        super(props);
        this.toggleNav = this.toggleNav.bind(this);
        this.state = {
            isNavOpen: false,            
        };
        this.toggleNav = this.toggleNav.bind(this);        
    }

    toggleNav() {
        this.setState({isNavOpen: !this.state.isNavOpen});
    }
    render(){
        return(
            <>
            <Navbar dark expand="md">
            <div className="container">
            <NavbarToggler onClick={this.toggleNav} />
            <NavbarBrand className="offset-md-4 mr-auto" href="/">
            <img src={baseUrl + "/assets/images/logo.png"} height="60" alt="Calendario Cineteca" /> Calendario Cineteca di Bologna
            </NavbarBrand>
            
            </div>
            </Navbar>
            </>
        );
    }
}

export default Header;