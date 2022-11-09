import React, { Component } from 'react';
import {
    Collapse,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink
} from 'reactstrap';
import {
    BrowserRouter,
    Route,
    Switch,
    Link
} from 'react-router-dom';
import logo from '../assets/appLogo.png';

class MyNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: true
        };
        this.toogleNavbar = this.toogleNavbar.bind(this);
    }

    toogleNavbar() {
        this.setState({
            collapse: !this.state.collapse
        });
    }

    render() {
        return (
            <Navbar color="dark" dark>
                <NavbarBrand href="/" className="mr-auto">
                    <img
                        alt=""
                        src={logo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                    {' Aiden'}
                </NavbarBrand>
                <NavbarToggler onClick={this.toogleNavbar} className="mr-2"/>
                <Collapse isOpen={!this.state.collapse} navbar>
                    <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="https://ithelp.ithome.com.tw/users/20119510/articles">關於我</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/AidenYang12345">GitHub</NavLink>
                            </NavItem>
                    </Nav>
                </Collapse>
            </Navbar >
        )
    }
}

export default MyNavbar;