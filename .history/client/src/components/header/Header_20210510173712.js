import React from 'react';
import 'react-bootstrap';
import styled  from 'styled-components';
import { Navbar } from 'react-bootstrap'
import Flash from '../Flash/flashmessage'

import "../style.css"

const Header = () => {
    return(  
        <>
         <Flash />
        <Navbar className="Nav fixed-top" variant="dark">
            <Navbar.Brand className = "align-left" href="">
            <img
                alt=""
                src="nav_logo.png"
                className="d-inline-block align-top ml-3"
                height="60"
                width = "60"
            />
            <h2 className="d-inline-block ml-3 mt-2 " style={{fontSize:40}}>Inventory Management System</h2>
            </Navbar.Brand>
        </Navbar>
       
        </>
    )
};

export default Header;

// const Nav = styled(Navbar)`
//     // background:  rgba(0,0,0,0.8);
//     background: #1F386B;

// `;

