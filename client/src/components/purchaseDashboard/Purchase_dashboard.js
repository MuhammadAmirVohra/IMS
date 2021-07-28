import RequestTable from '../purchaseRequest/Purchase_request_table'
// import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap'
import UserInformation from '../userInformation/User_information.js';
import HeaderPages from '../header/Header_pages';
import "../style.css"
const PurchaseDashboard = () => {

    return (
        <>
            <HeaderPages />
            <Container className="MainContainer">

                <UserInformation />
                <br />
                <Link to="/dashboard"> <Button className="Btn btn btn-md mt-4 mb-4 float-right"> Requisition Form </Button> </Link>
                <Link to="/productledger"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Product Ledger </Button> </Link>
                <Link to="/stockreport"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Stock Report </Button> </Link>
                <Link to="/previousrequests"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Previous Requests </Button> </Link>

                <RequestTable />
            </Container>
        </>
    )


}

export default PurchaseDashboard;

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