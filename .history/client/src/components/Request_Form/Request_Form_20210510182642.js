import React, { useState } from 'react';
import 'react-bootstrap'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
// import styled  from 'styled-components';
import axios from 'axios';
import { API_URL } from '../../utils/constant';
import "../style.css"
const RequestForm = ()=>{
    // const Auth = React.useContext(AuthApi);
    // const history = useHistory();

    const [request, setRequest] = useState({
        Name : "",
        email: "",
        itemname: "",
        qty : "",
        duration: "",
        reason: ""
    });
   
    // Functions

    const onChangeHandle = (e) => {
        const value = e.target.value;
        // console.log(value);
        setRequest({
            ...request,
            [e.target.name] : value
       });
    }
    const onSubmit = (event) => {   
        
        event.preventDefault()
        axios({
            method: "POST",
            data: {
                R_Emp_Name: request.Name,
                R_Emp_Email: request.email,
                Item: request.itemname,
                Quantity: request.qty,
                Duration: request.duration,
                Reason: request.reason
            },
            withCredentials: true,
            url: `${API_URL}/add_request`,
          }).then((res)=>{
            console.log(res.data);      
            if(res.data) 
            {
                console.log(res.data)
                window.flash('Request Forwarded\nRequest ID : ' + res.data._id);
                setRequest({
                Name : "",
                email: "",
                itemname: "",
                qty : "",
                duration: "",
                reason: ""
            })

            }
            else
            {
                console.log('No user found')
            }
        })
        };
     

    return (
        <>
      
        <Container className="MainContainer mt-4 d-flex justify-content-left align-items-left">
            <Row>
                <Col className="text-left">
                    <Form className="FormStyle" onSubmit={onSubmit} >
                        <Form.Group >
                            <Form.Label>Name : </Form.Label>
                            <Form.Control placeholder="Enter Name" onChange={onChangeHandle} type="text" name="Name" value={request.Name} required/>                
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Email : </Form.Label>
                            <Form.Control placeholder="Enter Email" onChange={onChangeHandle} type="email" name="email" value={request.email} required/>
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Item : </Form.Label>
                            <Form.Control placeholder="Enter Item Name" onChange={onChangeHandle} type="text" name="itemname" value={request.itemname} required/>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Quantity : </Form.Label>
                                <Form.Control placeholder="Enter Quantity" onChange={onChangeHandle} type="number" name="qty" value={request.qty} required/>
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Duration : </Form.Label>
                                <Form.Control placeholder="Enter Duration" onChange={onChangeHandle} type="text" name="duration" value={request.duration}/>
                            </Form.Group>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>Reason : </Form.Label>
                            <Form.Control placeholder="Elaborate Reason(Optional)" as="textarea" rows={4} onChange={onChangeHandle} type="text" name="reason" value={request.reason} required/>
                        </Form.Group>
                        <Form.Group className="text-right">
                            {/* <a href="#"> Forgot Email ? </a> */}
                            <Button  type="submit" className = "Btn btn btn-md btn-success">Submit</Button>
                        </Form.Group>
                    </Form>   
                </Col> 
            </Row>
        </Container>  
        </> 
    )
    
};

    

export default RequestForm;

// const FormStyle = styled(Form)`
//     background-color: white;
//     width: 500px;
//     .form-group{  
//         &:hover{

//         }
//     }

// `;

// const MainContainer = styled(Container)`
//     width: 100%;
//   height: 100vh;
//   min-height: 100%;
//   min-height: 100vh;
// `;
// const Submit = styled(Button)`
//     background :#EFBB20;
//     border: none; 
//     &:hover{
//     background: #0e8ccc;
// }
// `;