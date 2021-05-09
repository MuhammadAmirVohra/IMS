import React from 'react';
import 'react-bootstrap';
import styled  from 'styled-components';
import { Navbar, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import Flash from '../Flash/flashmessage'

  

const HeaderPages = () => {
    return(  
        <>
       <Flash />
        <Nav className="fixed-top">
           
            <Link to="/logout" >
                <LogoutButton className="btn-primary btn-md mr-4">
                        Log Out
                </LogoutButton>
            </Link>
           
        </Nav>
        </>
    )
};

export default HeaderPages;

const Nav = styled(Navbar)`
    // background:  rgba(0,0,0,0.8);
    background: #1F386B;
    justify-content:flex-end;
`;

const LogoutButton = styled(Button)`
    background :#EFBB20;
    border: none; 
    &:hover{
    background: #0e8ccc;
}
`;