import HeaderPages from '../header/Header_pages';
import {Card, Form,Container, Button} from 'react-bootstrap';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import moment from 'moment';
// import styled from 'styled-components';
import download from 'downloadjs';
import { API_URL } from '../../utils/constant';
import {useHistory} from 'react-router';
import '../style.css'
const Account_Manager = () =>{ 

    const [comments, set_comments] = useState("")
    const  { id } = useParams();
    const history = useHistory();
    const [details, setDetails] = useState([]);
    // const [path, setPath] = useState("");
    console.log("Params " , id);
    
    async function fetch (){
        axios.get(`${API_URL}/` + id + '/accountsrequest')
    .then(
        (res) => {
            setDetails(res.data)
            // setPath(res.data.path)
            console.log(res.data) 
       
        } 
    )
    }

    useEffect (() =>{
        fetch();
        setInterval(()=>{fetch()}, 3000);

    },[])
    
    const SubmitComment = ()=>{
        axios.post(`${API_URL}/submitaccounts`, { id : id, comment : comments }).then((res)=>{
                if(res.data.code === 200)
                { 
                    console.log('Comment Added')
                    history.push('/managerdashboard')
                }
                else if(res.data.code === 404)
                { 
                    window.flash('Failed to submit comment', 'danger')
                    // console.log('Comment Added')
                    // history.push('/managerdashboard')
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
        <Container className = "MainContainer">

        <Card>
            <Card.Header>
                Request Details
            </Card.Header>
            <Card.Body>
                <Card.Title><strong>Name: </strong>{details.R_Emp_Name}</Card.Title>
                <Card.Title><strong>Email: </strong>{details.R_Emp_Email}</Card.Title>
                <Card.Title><strong>Item: </strong>{details.Item}</Card.Title>
                <Card.Title><strong>Duration: </strong>{details.Duration}</Card.Title>
                <Card.Title><strong>Quantity: </strong>{details.Quantity}</Card.Title>
                <Card.Title><strong>Reason : </strong>{details.Reason}</Card.Title>
                <Card.Title><strong>Date Requested </strong>{moment(details.Added).format('Do MMMM YYYY')}</Card.Title>
                
                <Button className = "Btn" onClick={Download}>Download Quotation</Button>
                
                <Form className="mt-4" onSubmit={SubmitComment}>
                    <Form.Group>
                        <Card.Title className="CardTitle">Add Comments<span>*</span></Card.Title>
                        <Form.Control placeholder="Enter Comments" as="textarea" row={5} value ={comments} onChange = { (e) => { set_comments(e.target.value) }} ></Form.Control>
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