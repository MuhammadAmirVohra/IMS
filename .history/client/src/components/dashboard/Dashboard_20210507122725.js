// import axios from 'axios';
import React from 'react';
import { Col, Container, Row} from 'react-bootstrap';
import RequestForm from '../Request_Form/Request_Form.js'
import HeaderPg from '../header/Header_pages'
import styled from 'styled-components';
import UserInfo from '../userInformation/User_information.js';
import TrackRequest from '../track/Track_request'





const Dashboard = () => {
    
    return(  

    <>
        <HeaderPg />
        <MainContainer>
        <Row>
            <Col>            
                <UserInfo/>
                <br/>
               <TrackRequest/>

            </Col>
            <Col>
                <h1>Requisition Form: </h1>
                <RequestForm />
            </Col>
        </Row>
       </MainContainer>
    </>        

)
    

};

export default Dashboard;
const MainContainer = styled(Container)`
    width: 100%;
    height: auto;
    min-height: 100%;
    min-height: 100vh;
    margin-top:100px;
`;
