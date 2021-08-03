import HeaderPages from '../header/Header_pages';
import { Card, Form, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { API_URL } from '../../utils/constant';
import download from 'downloadjs';
import { useHistory } from 'react-router';
import '../style.css'
const ManagerAdmin = () => {

    const history = useHistory();
    const { id } = useParams();
    const [admin_comment, set_admin] = useState("");
    const [request, set_request] = useState({});
    const [comment, set_comment] = useState({});
    const [department, setDepartment] = useState("");

    console.log("Params ", id);

    useEffect(() => {
        axios.get(`${API_URL}/` + id + '/adminrequest')
            .then(
                (res) => {
                    // setDetails(res.data)
                    set_request(res.data.request)
                    setDepartment(res.data.request.R_Emp_Dept.Dept_Name)
                    set_comment(res.data.comment)
                    console.log(res.data)

                }
            )
    }, [id])

    const SubmitComment = (e) => {
        e.preventDefault();
        axios.post(`${API_URL}/submitadmin`, { id: id, comment: admin_comment }).then((res) => {
            if (res.data.code === 200) {
                console.log('Comment Added')
                window.scrollTo(0, 0);
                history.push('/managerdashboard');
                setTimeout(() => {
                    window.flash('Successfully Added Comment & Request Forwarded to Director');
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
                        <Card.Title><strong>Request ID: </strong>{request.Order_ID}</Card.Title>
                        <Card.Title><strong>Name: </strong>{request.R_Emp_Name}</Card.Title>
                        <Card.Title><strong>Email: </strong>{request.R_Emp_Email}</Card.Title>
                        <Card.Title><strong>Department: </strong>{department}</Card.Title>
                        <Card.Title className="new-line"><strong>Item: </strong><br />{request.Item}</Card.Title>
                        {/* <Card.Title><strong>Duration: </strong>{request.Duration}</Card.Title>
                        <Card.Title><strong>Quantity: </strong>{request.Quantity}</Card.Title> */}
                        <Card.Title><strong>Reason : </strong>{request.Reason}</Card.Title>
                        <Card.Title><strong>Date Requested </strong>{moment(request.Added).format('Do MMMM YYYY')}</Card.Title>
                        <Card.Title><strong>Accounts Manager Comments : </strong>{comment.Comment_Accounts}</Card.Title>
                        <Button className="Btn" onClick={Download}>Download Quotation</Button>
                        <Form className="mt-4" onSubmit={SubmitComment}>
                            <Form.Group>
                                <Card.Title>Add Comments<span>*</span></Card.Title>
                                <Form.Control as="textarea" row={5} placeholder="Comments" value={admin_comment} onChange={(e) => { set_admin(e.target.value) }} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" className="Btn btn btn-md float-right"  >Submit</Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

        </>

    );

}

export default ManagerAdmin;
