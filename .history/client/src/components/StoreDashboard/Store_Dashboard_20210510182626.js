import RequestTable from '../storeTable/Store_Table'
// import axios from 'axios';
import {Link} from 'react-router-dom';
import {Button, Container} from 'react-bootstrap'
import UserInformation from '../userInformation/User_information.js';
// import styled from 'styled-components';
import HeaderPages from '../header/Header_pages';
import '../style.css'

const StoreDashboard = () =>{

return(
    <>
    <HeaderPages/>
    <Container className ="MainContainer" >
    
    <UserInformation />
    
    
    <Link to="/inventory"> <Button className="btn Btn btn-md mt-4 mb-4 float-right"> Inventory </Button> </Link>
    <Link to="/recieveitems"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Recieved Item </Button> </Link>
    
    
    <RequestTable/>
    </Container>
    </>
)


}

export default StoreDashboard;

// const Btn = styled(Button)`
//     background :#EFBB20;
//     border: none; 
//     &:hover{
//     background: #0e8ccc;
// }
// `;
// const MainContainer = styled(Container)`
//     width: 100%;
//     height: auto;
//     min-height: 100%;
//     min-height: 100vh;
//     margin-top:100px;
// `;