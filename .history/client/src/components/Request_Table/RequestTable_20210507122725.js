import React , { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Button,Container, Modal, Form} from 'react-bootstrap';
import moment from 'moment';
import styled from 'styled-components';
import { API_URL } from '../../utils/constant';

const RequestTable = () => {
   const arr = ['Requested By','Email','Date Requested','Item Name','Quantity','Duration']
    const [allrequest, setrequests] = useState([])
    // const [open, setOpen] = useState(false);

    async function fetch(){
        await axios.get(`${API_URL}/get_all_request`, {
             withCredentials: true
         }).then((res)=>{
             console.log(res.data);
             
             setrequests(res.data);
             
         })
        }
    // var requests = []
    useEffect( () =>{
    
    fetch()
    },[])
    const [showModal, setShow] = useState(false)
    const [ModalInfo, SetInfo] = useState({})
    const ModalContent = ()=>{
       const [comment , setcomment] = useState("")

        const Approve = ()=>{
            console.log('Approve Request')
            axios.post(`${API_URL}/request_approve`, {id : ModalInfo._id}).then(
                (res)=>{
                    if(res.data)
                    { 
                        window.flash('Request Approved')
                        setShow(false)
                        fetch()
                    }
                }
            )
        } 


        const Reject = ()=>{
            axios.post(`${API_URL}/request_reject`, {
                id : ModalInfo._id,
                name: ModalInfo.R_Emp_Name,
                email : ModalInfo.R_Emp_Email,
                item : ModalInfo.Item,
                comment : comment
            }).then(
                (res)=>{
                    if(res.data)
                    { 
                        window.flash('Request Rejected')
                        setShow(false)
                        fetch()
                    }
                }
            )
        } 

        return(
            <Modal show = {showModal} onHide ={() => {setShow(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Details 
                    </Modal.Title>
                    </Modal.Header>
                    <Form>
                       
                    <ModalBody>
                        <ul className="list-unstyled">
                            <li><strong>Requested by:</strong> {ModalInfo.R_Emp_Name}</li>
                            <li><strong>Email:</strong> {ModalInfo.R_Emp_Email}</li>
                            <li><strong>Item:</strong> {ModalInfo.Item}</li>
                            <li><strong>Quantity:</strong> {ModalInfo.Quantity}</li>
                            <li><strong>Duration:</strong> {ModalInfo.Duration}</li>
                            <li><strong>Reason:</strong> {ModalInfo.Reason}</li>
                            <li className="mt-3">
                                    <Form.Group>
                                        <Form.Control as="textarea" value ={comment} onChange={(event)=>{ setcomment(event.target.value) }}  placeholder = "Additional Comments"  row={6}/>
                                    </Form.Group>
                                
                            </li>
                        </ul>
                    </ModalBody>

                
                <Modal.Footer>
                    <Btn className = "btn-success" onClick = {() => {Approve()}}>Approve</Btn>
                    <Btn className="btn-danger" onClick = {Reject}>Reject</Btn>
                        
                </Modal.Footer>
                </Form>
            </Modal>
        );
        

    }
    


    return(
        <>
        {showModal?
            <div>
                <ModalContent/>
            </div>
        :null   
        }



     <Container>
         { allrequest.length > 0 &&
        <TableStyle responsive>
        <thead>
            <tr>
             <th>#</th>
            {arr.map((_, index) => (
              <th key={index}>{_}</th>
            ))}
            
          </tr>
        </thead>
        <tbody>
          {allrequest.map((request, index) =>{
            return(
            <>
            <tr onClick = {() => {SetInfo(request); setShow(true);} }>
                <td>{index+1}</td>
                <td>{request.R_Emp_Name}<br/></td>
                <td>{request.R_Emp_Email}</td>
                <td>{moment(request.Added).format('Do MMMM YYYY')}</td>
                <td>{request.Item}</td>
                <td>{request.Quantity}</td>
                <td>{request.Duration}</td>
                
            </tr>
            
           
            </>
            )
          })}
        </tbody>
      </TableStyle>
      
      }
      {
          allrequest.length === 0 && <h2>No Requests.</h2>
      }
        
      </Container>
      </>
    )


}


export default RequestTable

const TableStyle = styled(Table)`
th {background: #1F386B; color:white;}
tr{
    cursor:pointer;
    &:hover{
        // background: #1F386B;
    }
}
`;

const Btn = styled(Button)`
&:hover{
    background: #0e8ccc;
}

`;

const ModalBody = styled(Modal.Body)`

li{
    padding:5px;
}

`;