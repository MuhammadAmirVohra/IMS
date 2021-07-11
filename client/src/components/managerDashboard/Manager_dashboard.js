import RequestTable from "../ManagerRequestTable/ManagerRequestTable";
// import axios from 'axios';
// import {Link} from 'react-router-dom';
import { Container } from "react-bootstrap";
import UserInformation from "../userInformation/User_information.js";
import styled from "styled-components";
import HeaderPages from "../header/Header_pages";
import "../style.css";
const AdminDashboard = () => {
  return (
    <>
      <HeaderPages />
      <Container className="MainContainer">
        <UserInformation />
        <br />
        <RequestTable />
      </Container>
    </>
  );
};

export default AdminDashboard;

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
