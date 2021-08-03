import HeaderPages from '../header/Header_pages';
import {Card,Container, Button} from 'react-bootstrap';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
// import Pdf from "react-to-pdf";
import {useHistory} from 'react-router';
// import ReactDOM from "react-dom";
import React from "react";
import { API_URL } from '../../utils/constant';
import download from 'downloadjs';
import '../style.css'

const Director = () =>{ 
        
    const history = useHistory();
    const { id } = useParams();
    const [details, setDetails] = useState({request : {}, comment : []});
    // const [Hide, setHide] = useState(false);

    console.log("Params " , id);
    const ref = React.createRef();

    // const PDF =()=>{
    //     axios.get(`${API_URL}/pdf`).then((res)=>{
    //         console.log(res.data)
    //     }) 
    // }
    // const [req_id, set_req_id] = useState("")
    useEffect (() =>{
        axios.get(`${API_URL}/` + id + '/directorrequest')
        .then(
            (res) => {
                setDetails(res.data)
                // set_req_id(id);
                console.log(id)
                // console.log(details.request._id) 
        
            } 
        )
    },[id])
    
    const Accept = ()=>{
        axios.post(`${API_URL}/`+id+'/acceptdirector').then((res)=>{
                if(res.status === 200)
                { 
                    console.log('Requested Accepted');
                    window.flash('Requested Accepted');
                    history.push('/managerdashboard');

                }
                else
                {
                    console.log('Requested Failed to Accept');
                    window.flash('Requested Failed to Accept', 'danger');
                }
        })
    }
    

    const Reject = ()=>{
        axios.post(`${API_URL}/`+id+'/rejectdirector', {
            name : details.request.R_Emp_Name,
            email : details.request.R_Emp_Email,
            item : details.request.Item
        }).then((res)=>{
            if(res.status === 200)
            { 
                console.log('Requested Rejected');
                window.flash('Requested Rejected');
                history.push('/managerdashboard');

            }
            else
            {
                console.log('Requested Failed to Reject');
                window.flash('Requested Failed to Reject', 'danger');
            }
        })
    }



    const Download = async ()=>{
        await axios.get(`${API_URL}/${id}/download`, {
            responseType: 'blob'
          }).then((res)=>{
            download(res.data, details.request.Item + '_quotation', 'pdf');
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
            <Card.Body ref = {ref}>
                <Card.Title><strong>ID: </strong>{id}</Card.Title>
                <Card.Title><strong>Name: </strong>{details.request.R_Emp_Name}</Card.Title>
                <Card.Title><strong>Email: </strong>{details.request.R_Emp_Email}</Card.Title>
                <Card.Title><strong>Item: </strong>{details.request.Item}</Card.Title>
                <Card.Title><strong>Duration: </strong>{details.request.Duration}</Card.Title>
                <Card.Title><strong>Quantity: </strong>{details.request.Quantity}</Card.Title>
                <Card.Title><strong>Reason : </strong>{details.request.Reason}</Card.Title>
                <Card.Title><strong>Date Requested </strong>{moment(details.request.Added).format('Do MMMM YYYY')}</Card.Title>
                <Card.Title><strong>Accounts Manager Comments : </strong>{details.comment.Comment_Accounts}</Card.Title>
                <Card.Title><strong>Admin Manager Comments : </strong>{details.comment.Comment_Admin}</Card.Title>
                <Btn onClick={Download}>Download Quotation</Btn>
              
            </Card.Body>
            <Card.Footer>
            {/* <Pdf targetRef={ref} filename="code-example.pdf">
                 {({ toPdf }) => <Btn onClick={ () => { toPdf()}}>Generate Pdf</Btn>}
            </Pdf> */}
            <Btn><a href = {`${API_URL}/` + id + '/pdf'}>Generate Pdf</a></Btn>
            <Btn onClick={Accept}>Accept</Btn>
            <Btn onClick={Reject}>Reject</Btn>
            </Card.Footer>
        </Card>
        </MainContainer>
        
       </>
        
    );

}

export default Director;
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
    a{
        color: white;
        text-decoration : none;
    }
}`;
