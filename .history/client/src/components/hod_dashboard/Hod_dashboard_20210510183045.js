import RequestTable from '../Request_Table/RequestTable'
// import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Container} from 'react-bootstrap'
import UserInformation from '../userInformation/User_information.js';
// import styled from 'styled-components';
import HeaderPages from '../header/Header_pages';
import '../style.css'
const Hod_dashboard = () =>{

return(
    <>
    <HeaderPages/>
    <Container className ="MainContainer">
    
    <UserInformation />
    
    <Link to="/dashboard"> <Button className="Btn btn btn-md mt-4 mb-4 float-right"> Requisition Form </Button> </Link>
    
    <RequestTable/>
    </Container>
    </>
)


}

export default Hod_dashboard;

