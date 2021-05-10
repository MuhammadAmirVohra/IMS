import axios from "axios";
import React, { useState } from "react";
import { API_URL } from '../../utils/constant';

import {

  Form,
  Button,
  Collapse,
  Card,
} from "react-bootstrap";
import styled from "styled-components";

const TrackRequest = () => {
    const [trackID,settrackID] = useState({})
    
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [errMsg, seterr] = useState("");
    const [status,setStatus] = useState({
        
        status:"",
        item: ""
        
    })
    const onChangeHandle = (e) => {
        const value = e.target.value;
        // console.log(value);
        settrackID(value);
    }
    
    const GetRequest = (event) =>
    {
        setShow(false)
        seterr("")
        event.preventDefault();
        axios.post(`${API_URL}/get_request`, {
            id : trackID
        }).then((res)=>{

            console.log( 'STATUSSSS' , res.data);
            
           if(res.data.code ===  404)
           {
                seterr(res.data.message);
           }
           else
           {
            setStatus({
                status: res.data.Status,
                item:res.data.Item
             })
             setShow(true)
             seterr("")
           }
        })
    }
    
    




  return (
    <>
      <Btn
        className="mb-4"
        onClick={() => setOpen(!open)}
        aria-controls="collapse_menu"
        aria-expanded={open}
      >
        Track Request
      </Btn>

      <Collapse in={open}>
        <div id="collapse_menu">
          <Form onSubmit={GetRequest}>
            <Form.Control
              type="text"
              placeholder="Request ID"
              onChange={onChangeHandle}
              name="RequestID"
            ></Form.Control>
            <br />
            <Btn type="submit">Submit</Btn>
          </Form>
          
          <h3 className="mt-2">{errMsg}</h3>
          {show && 
            <>
              <Card className="mt-4">
                <Card.Header>Request Status</Card.Header>
                <Card.Body>
                   
                  
                  { 
                  (status.status === 'Requested' || status.status === 'Approved' || status.status === 'Completed' || status.status === 'Issued') ?           
                   <Card.Title>Status: {status.status}</Card.Title>
                  :<Card.Title>Status: Pending</Card.Title>
                  
                  }
                  
                  
                  
                  <Card.Title>Item: {status.item}</Card.Title>
                
                </Card.Body>
              </Card>
            </>
          }
        </div>
      </Collapse>
    </>
  );
};

export default TrackRequest;


const Btn = styled(Button)`

background :#EFBB20;
border: none; 
&:hover{
background: #0e8ccc;
}

`;
