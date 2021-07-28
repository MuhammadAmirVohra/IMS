import HeaderPages from '../header/Header_pages';
import { Card, Form, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import download from 'downloadjs';
import { API_URL } from '../../utils/constant';
import { useHistory } from 'react-router';
import '../style.css'
const Account_Manager = () => {

    const [comments, set_comments] = useState("")
    const { id } = useParams();
    const history = useHistory();
    const [details, setDetails] = useState({});
    const [department, setDepartment] = useState("");
    // const [path, setPath] = useState("");
    console.log("Params ", id);
    useEffect(() => {
        axios.get(`${API_URL}/` + id + '/accountsrequest')
            .then(
                (res) => {
                    setDetails(res.data)
                    setDepartment(res.data.R_Emp_Dept.Dept_Name)
                    console.log('Request : ' + res.data)

                }
            )
    }, [id])

    const SubmitComment = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/submitaccounts`, { id: id, comment: comments }).then((res) => {
            console.log(res.data);
            if (res.data.code === 200) {
                console.log('Comment Added')
                window.scrollTo(0, 0);

                history.push('/managerdashboard');

                setTimeout(() => {

                    window.flash('Successfully Added Comment & Request Forwarded to Admin');
                }, 500);

            }
            else if (res.data.code === 404) {
                window.scrollTo(0, 0);
                history.push('/managerdashboard');
                setTimeout(() => {
                    window.flash('Failed to submit comment', 'danger')
                }, 500);

                // console.log('Comment Added')
                // history.push('/managerdashboard')
            }
        })
    }

    const SendBack = () => {
        axios.post(`${API_URL}/sendbacktopurchase`, { id: id, comment: comments }).then((res) => {
            if (res.data.code === 200) {
                console.log('Comment Added')
                window.scrollTo(0, 0);
                history.push('/managerdashboard');
                setTimeout(() => {
                    window.flash('Sended Back to Purchase Department')
                }, 500);


            }
            else if (res.data.code === 404) {
                window.scrollTo(0, 0);
                history.push('/managerdashboard');
                setTimeout(() => {
                    window.flash('Failed to Send Back', 'danger')
                }, 500);

                // console.log('Comment Added')
                // history.push('/managerdashboard')
            }
        })
    }



    const Download = async () => {
        await axios.get(`${API_URL}/${id}/download`, {
            responseType: 'blob'
        }).then((res) => {
            download(res.data, 'quotation', 'pdf');
        })
    }



    return (

        <>
            <HeaderPages />
            <Container className="MainContainer">

                <Card>
                    <Card.Header>
                        Request Details
                    </Card.Header>
                    <Card.Body>
                        <Card.Title><strong>Request ID: </strong>{details.Order_ID}</Card.Title>
                        <Card.Title><strong>Name: </strong>{details.R_Emp_Name}</Card.Title>
                        <Card.Title><strong>Email: </strong>{details.R_Emp_Email}</Card.Title>
                        <Card.Title><strong>Department: </strong>{department}</Card.Title>
                        <Card.Title className="new-line"><strong>Item: </strong><br />{details.Item}</Card.Title>
                        {/* <Card.Title><strong>Duration: </strong>{details.Duration}</Card.Title>
                        <Card.Title><strong>Quantity: </strong>{details.Quantity}</Card.Title> */}
                        <Card.Title><strong>Reason : </strong>{details.Reason}</Card.Title>
                        <Card.Title><strong>Date Requested </strong>{moment(details.Added).format('Do MMMM YYYY')}</Card.Title>

                        <Button className="Btn" onClick={Download}>Download Quotation</Button>

                        <Form className="mt-4" onSubmit={SubmitComment}>
                            <Form.Group>
                                <Card.Title className="CardTitle">Add Comments<span>*</span></Card.Title>
                                <Form.Control placeholder="Enter Comments" as="textarea" row={5} value={comments} onChange={(e) => { set_comments(e.target.value) }} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" className="Btn btn btn-md float-right"  >Submit Comments</Button>
                                <Button className="mr-3 btn-danger float-right" onClick={SendBack}>Send Back to Purchase</Button>

                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

        </>

    );

}

export default Account_Manager;
// const MainContainer = styled(Container)`
//     width: 100%;
//     height: auto;
//     min-height: 100%;
//     min-height: 100vh;
//     margin-top:100px;
// `;


// const Btn = styled(Button)`
//     background :#EFBB20;
//     border: none;
//     &:hover{
//     background: #0e8ccc;
// }`;

// const CardTitle = styled(Card.Title)`
// span{
//     color : red;
// }
// `;