import HeaderPages from '../header/Header_pages';
import {Card, Form,Container, Button} from 'react-bootstrap';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { API_URL } from '../../utils/constant';
import download from 'downloadjs';
import {useHistory} from 'react-router';

const ManagerAdmin = () =>{ 

    const history = useHistory();
    const { id } = useParams();
    const [admin_comment, set_admin] = useState("");
    const [request, set_request] = useState({});
    const [comment, set_comment] = useState({});

    console.log("Params " , id);
    
    useEffect (() =>{
        axios.get(`${API_URL}/` + id + '/adminrequest')
        .then(
            (res) => {
                // setDetails(res.data)
                set_request(res.data.request)
                set_comment(res.data.comment)
                console.log(res.data) 
        
            } 
        )
    },[id])
    
    const SubmitComment = ()=>{
        axios.post(`${API_URL}/submitadmin`, { id : id, comment : admin_comment }).then((res)=>{
                if(res.status === 200)
                { 
                    console.log('Comment Added');
                    history.push('/managerdashboard')
                }
        })
    }
    



    const Download = async ()=>{
        await axios.get(`${API_URL}/${id}/download`, {
            responseType: 'blob'
          }).then((res)=>{
            download(res.data, 'quotation', 'pdf');
          })
    }

    return(
        
        <>
        <HeaderPages/>
        <MainContainer>

        <Card>
            <Card.Header>
                Request Details
            </Card.Header>
            <Card.Body>
                <Card.Title><strong>Name: </strong>{request.R_Emp_Name}</Card.Title>
                <Card.Title><strong>Email: </strong>{request.R_Emp_Email}</Card.Title>
                <Card.Title><strong>Item: </strong>{request.Item}</Card.Title>
                <Card.Title><strong>Duration: </strong>{request.Duration}</Card.Title>
                <Card.Title><strong>Quantity: </strong>{request.Quantity}</Card.Title>
                <Card.Title><strong>Reason : </strong>{request.Reason}</Card.Title>
                <Card.Title><strong>Date Requested </strong>{moment(request.Added).format('Do MMMM YYYY')}</Card.Title>
                <Card.Title><strong>Accounts Manager Comments : </strong>{comment.Comment_Accounts}</Card.Title>
                <Btn onClick={Download}>Download Quotation</Btn>
                <Form className="mt-4" onSubmit={SubmitComment}>
                    <Form.Group>
                        <CardTitle>Add Comments<span>*</span></CardTitle>
                        <Form.Control as="textarea" row={5} value = {admin_comment} onChange = {(e) => { set_admin(e.target.value) }}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Btn type="submit" className="btn btn-md float-right"  >Submit</Btn>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
        </MainContainer>
        
       </>
        
    );

}

export default ManagerAdmin;
const MainContainer = styled(Container)`
    width: 100%;
    height: auto;
    min-height: 100%;
    min-height: 100vh;
    margin-top:100px;
`;


const Btn = styled(Button)`
    background :#EFBB20;
    border: none; 
    &:hover{
    background: #0e8ccc;
}`;

const CardTitle = styled(Card.Title)`
span{
    color : red;
}
`;

