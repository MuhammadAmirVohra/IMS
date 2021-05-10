import RequestTable from '../Request_Table/RequestTable'
// import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Container} from 'react-bootstrap'
import UserInformation from '../userInformation/User_information.js';
import styled from 'styled-components';
import HeaderPages from '../header/Header_pages';

const Hod_dashboard = () =>{

return(
    <>
    <HeaderPages/>
    <MainContainer >
    
    <UserInformation />
    
    <Link to="/dashboard"> <Btn className="btn btn-md mt-4 mb-4 float-right"> Requisition Form </Btn> </Link>
    
    <RequestTable/>
    </MainContainer>
    </>
)


}

export default Hod_dashboard;

const Btn = styled(Button)`
    background :#EFBB20;
    border: none; 
    &:hover{
    background: #0e8ccc;
}
`;
const MainContainer = styled(Container)`
    width: 100%;
    height: auto;
    min-height: 100%;
    min-height: 100vh;
    margin-top:100px;
`;