import HeaderPages from '../header/Header_pages';
import { Card, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

// import Pdf from "react-to-pdf";
import { useHistory } from 'react-router';
// import ReactDOM from "react-dom";
import React from "react";
import { API_URL } from '../../utils/constant';
import download from 'downloadjs';
import '../style.css'

const Director = () => {

    const history = useHistory();
    const { id } = useParams();
    const [details, setDetails] = useState({ request: {}, comment: [] });
    const [Department, setDepartment] = useState("");
    const [generate_btn, setbtn] = useState("Generate PDF");
    console.log("Params ", id);
    const ref = React.createRef();

    // const PDF =()=>{
    //     axios.get(`${API_URL}/pdf`).then((res)=>{
    //         console.log(res.data)
    //     })
    // }
    // const [req_id, set_req_id] = useState("")
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

    const Accept = () => {
        axios.post(`${API_URL}/` + id + '/acceptdirector').then((res) => {
            if (res.status === 200) {
                console.log('Requested Accepted');
                window.scrollTo(0, 0);
                history.push('/managerdashboard');
                setTimeout(() => {
                    window.flash('Requested Accepted');
                }, 500);



            }
            else {
                console.log('Requested Failed to Accept');
                window.scrollTo(0, 0);
                history.push('/managerdashboard');
                setTimeout(() => {
                    window.flash('Requested Failed to Accept', 'danger');
                }, 500);

            }
        })
    }


    const Reject = () => {
        axios.post(`${API_URL}/` + id + '/rejectdirector', {
            name: details.request.R_Emp_Name,
            email: details.request.R_Emp_Email,
            item: details.request.Item
        }).then((res) => {
            if (res.status === 200) {
                console.log('Requested Rejected');
                window.flash('Requested Rejected');
                history.push('/managerdashboard');

            }
            else {
                console.log('Requested Failed to Reject');
                window.flash('Requested Failed to Reject', 'danger');
            }
        })
    }

    const PDF = async () => {
        setbtn("Generating ...");
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
            console.log(res.status);
            if (res.status === 200) {
                const blob = await res.blob();
                const file = new Blob(
                    [blob],
                    { type: 'application/pdf' },
                    { name: 'report.pdf' }
                );
                console.log(file);
                console.log(blob);

                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                //Open the URL on new Window
                console.log(fileURL);
                setbtn("Generate PDF");

                //   download(res.data, details.request.Item + '_report', 'pdf');
                window.open(fileURL);
            }
            else {
                console.log(res);
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
                        <Card.Title><strong>Request ID: </strong>{details.request.Order_ID}</Card.Title>
                        <Card.Title><strong>Name: </strong>{details.request.R_Emp_Name}</Card.Title>
                        <Card.Title><strong>Email: </strong>{details.request.R_Emp_Email}</Card.Title>
                        <Card.Title><strong>Department: </strong>{Department}</Card.Title>
                        <Card.Title className="new-line"><strong>Item: </strong><br />{details.request.Item}</Card.Title>
                        {/* <Card.Title><strong>Duration: </strong>{details.request.Duration}</Card.Title>
                        <Card.Title><strong>Quantity: </strong>{details.request.Quantity}</Card.Title> */}
                        <Card.Title><strong>Reason : </strong>{details.request.Reason}</Card.Title>
                        <Card.Title><strong>Date Requested </strong>{moment(details.request.Added).format('Do MMMM YYYY')}</Card.Title>
                        <Card.Title><strong>Accounts Manager Comments : </strong><p className="new-line ml-3">{details.comment.Comment_Accounts}</p></Card.Title>
                        <Card.Title><strong>Admin Manager Comments : </strong><p className="new-line ml-3">{details.comment.Comment_Admin}</p></Card.Title>
                        <Button className="Btn" onClick={Download}>Download Quotation</Button>

                    </Card.Body>
                    <Card.Footer className="">
                        {/* <Pdf targetRef={ref} filename="code-example.pdf">
                 {({ toPdf }) => <Btn onClick={ () => { toPdf()}}>Generate Pdf</Btn>}
            </Pdf> */}
                        <Button className="btn-danger ml-4 float-right" onClick={Reject}>Reject</Button>
                        <Button className="btn-success ml-4 float-right" onClick={Accept}>Accept</Button>


                        {/* <Button className = "Btn float-right"><a href = {`${API_URL}/${id}/pdf`}>Generate Pdf</a></Button> */}
                        <Button className="Btn float-right" onClick={PDF}>{generate_btn}</Button>

                    </Card.Footer>
                </Card>
            </Container>

        </>

    );

}

export default Director;
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
//     a{
//         color: white;
//         text-decoration : none;
//     }
// }`;
