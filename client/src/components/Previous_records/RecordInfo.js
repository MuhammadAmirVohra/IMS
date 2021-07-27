import HeaderPages from '../header/Header_pages';
import { Card, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

// import Pdf from "react-to-pdf";
import download from 'downloadjs';
// import ReactDOM from "react-dom";
import React from "react";
import { API_URL } from '../../utils/constant';

import '../style.css'

const ReqInfo = () => {


    const { id } = useParams();
    const [details, setDetails] = useState({ request: {}, comment: [] });
    const [Department, setDepartment] = useState("");

    console.log("Params ", id);
    const ref = React.createRef();


    useEffect(() => {
        axios.get(`${API_URL}/` + id + '/directorrequest')
            .then(
                (res) => {
                    setDetails(res.data)
                    setDepartment(res.data.request.R_Emp_Dept.Dept_Name)
                    console.log(id)
                    // console.log(details.request._id)

                }
            )
    }, [id])






    const PDF = async () => {
        fetch(`${API_URL}/${id}/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: "report",
                content: "Testing Content"
            }),
        }).then(async res => {
            if (res.status === 200) {
                const blob = await res.blob();
                const file = new Blob(
                    [blob],
                    { type: 'application/pdf' },
                    { name: 'report.pdf' }
                );
                console.log(file)

                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                console.log(fileURL)
                //   download(res.data, details.request.Item + '_report', 'pdf');
                window.open(fileURL);
            }
        })
    }

    const Download = async () => {
        await axios.get(`${API_URL}/${id}/download`, {
            responseType: 'blob'
        }).then((res) => {
            download(res.data, details.request.Item + '_quotation', 'pdf');
        })
    }


    return (

        <>
            <HeaderPages />
            <Container className="MainContainer">

                <Card className="Card1">
                    <Card.Header>
                        Request Details
                    </Card.Header>
                    <Card.Body ref={ref}>
                        <Card.Title><strong>ID: </strong>{id}</Card.Title>
                        <Card.Title><strong>Name: </strong>{details.request.R_Emp_Name}</Card.Title>
                        <Card.Title><strong>Email: </strong>{details.request.R_Emp_Email}</Card.Title>
                        <Card.Title><strong>Department: </strong>{Department}</Card.Title>
                        <Card.Title className="new-line"><strong>Item: </strong><br />{details.request.Item}</Card.Title>
                        {/* <Card.Title><strong>Duration: </strong>{details.request.Duration}</Card.Title>
                        <Card.Title><strong>Quantity: </strong>{details.request.Quantity}</Card.Title> */}
                        <Card.Title><strong>Reason : </strong>{details.request.Reason}</Card.Title>
                        <Card.Title><strong>Date Requested </strong>{moment(details.request.Added).format('Do MMMM YYYY')}</Card.Title>
                        <Card.Title><strong>Accounts Manager Comments : </strong>{details.comment.Comment_Accounts}</Card.Title>
                        <Card.Title><strong>Admin Manager Comments : </strong>{details.comment.Comment_Admin}</Card.Title>
                        <Button className="Btn" onClick={Download}>Download Quotation</Button>

                    </Card.Body>
                    <Card.Footer className="">
                        {/* <Pdf targetRef={ref} filename="code-example.pdf">
                 {({ toPdf }) => <Btn onClick={ () => { toPdf()}}>Generate Pdf</Btn>}
            </Pdf> */}


                        {/* <Button className = "Btn float-right"><a href = {`${API_URL}/${id}/pdf`}>Generate Pdf</a></Button> */}
                        <Button className="Btn float-right" onClick={PDF}>Generate PDF</Button>

                    </Card.Footer>
                </Card>
            </Container>

        </>

    );

}

export default ReqInfo;

