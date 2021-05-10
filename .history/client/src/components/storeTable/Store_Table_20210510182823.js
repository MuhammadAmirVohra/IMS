import React , { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Container,OverlayTrigger,Tooltip} from 'react-bootstrap';
// import styled from 'styled-components';
import {useHistory} from 'react-router-dom';
import { API_URL } from '../../utils/constant';

const RequestTable = () => {
    const arr = ['Requested By','Email','Item Name','Quantity','Duration']
    const [allrequest, setrequests] = useState([])
    const history = useHistory()
    async function fetch(){
        await axios.get(`${API_URL}/storerequests`, {
            withCredentials: true
        }).then((res)=>{
            console.log(res.data);
            setrequests(res.data);
            
        })
    } 
    const onIssue = (id)=>{
        
        console.log("STORE TABLE MAIN ID FOR PARAMS",id)
        history.push('/'+id+'/issuerequest')
    }


    // const onPurchase = (id)=>{
    //     axios.post(`${API_URL}/request_forward_purchase`, { id : id}).then(
    //         (res)=>{
    //             if(res.data)
    //             { 
    //                 setShow(false)
    //                 window.flash('Request Forwarded to Purchase Department')
    //                 fetch();
    //             }
    //         }
    //     )

    // }
        
    // const onCancel = (_id, email, name, item) => {
    //     axios.post(`${API_URL}/request_cancel`, {id : _id, email : email, name : name, item : item}).then(
    //         (res)=>{
    //             if(res.data)
    //             { 
    //                 window.flash('Request Cancelled');
    //                 fetch();

    //             }
    //         }
    //     )
    // }

    

    // var requests = []
    useEffect( () =>{
        setInterval(()=>{fetch()}, 3000);

    },[])


    // const [showModal, setShow] = useState(false)
    // const [ModalInfo, SetInfo] = useState({})
    // const ModalContent = ()=>{
       
    //     return(
    //         <Modal show = {showModal} onHide ={() => {setShow(false)}}>
    //             <Modal.Header closeButton>
    //                 <Modal.Title>
    //                     Details 
    //                 </Modal.Title>
    //                        </Modal.Header>
    //                 <ModalBody>
    //                     <ul className="list-unstyled">
    //                         <li><strong>Requested by:</strong> {ModalInfo.R_Emp_Name}</li>
    //                         <li><strong>Email:</strong> {ModalInfo.R_Emp_Email}</li>
    //                         <li><strong>Item:</strong> {ModalInfo.Item}</li>
    //                         <li><strong>Quantity:</strong> {ModalInfo.Quantity}</li>
    //                         <li><strong>Duration:</strong> {ModalInfo.Duration}</li>
    //                         <li><strong>Reason:</strong> {ModalInfo.Reason}</li>
    //                         <li className="mt-3">
    //                             <Form>
    //                                 <Form.Group>
    //                                     <Form.Control as="textarea" placeholder = "Additional Comments" row={6}/>
    //                                 </Form.Group>
    //                             </Form>
    //                         </li>
    //                     </ul>
    //                 </ModalBody>

                
    //             <Modal.Footer>
    //                 {/* <Btn className = "btn-success">Approve</Btn>
    //                 <Btn className="btn-danger">Reject</Btn> */}
    //                 <Btn className="btn-success" onClick= {() => {onPurchase()}}>Send To Purchase Department</Btn>
                        
    //             </Modal.Footer>
    //         </Modal>
    //     );
        

    // }
    


    return(
        <>
        {/* {showModal?
            <div>
                <ModalContent/>
            </div>
        :null   
        } */}

     <Container>
         { allrequest.length > 0 &&
        <Table className="TableStyle" responsive>
        <thead>
            <>
            <tr>
             <th>#</th>
            {arr.map((_, index) => (
              <th key={index}>{_}</th>
            ))}
            <th></th>
          </tr>
</>
        </thead>
        <tbody>
          {allrequest.map((request, index) =>{
            return(
            <>
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Click to see Details</Tooltip>} >
            <tr key={index} onClick = {() => {onIssue(request._id)} }>
                <td>{index+1}</td>
                <td>{request.R_Emp_Name}<br/></td>
                <td>{request.R_Emp_Email}</td>
                
                <td>{request.Item}</td>
                <td>{request.Quantity}</td>
                <td>{request.Duration}</td>
                    
                {/* <td>
                    <Btn onClick = {() => {SetInfo(request); setShow(true);} } className = "mr-1"> Details </Btn>
                    <Btn onClick={()=>onIssue(request._id)} className = "btn-success mr-1">Issue</Btn>
                <Btn onClick={()=>onCancel(request._id, request.R_Emp_Email, request.R_Emp_Name, request.Item)} className="btn-danger">Cancel</Btn>
                </td> */}
            </tr>
            </OverlayTrigger>
           
            </>
            )
          })}
        </tbody>
      </Table>
      
      }
      {
          allrequest.length === 0 && <h2>No Requests.</h2>
      }
        
      </Container>
      </>
    )


}


export default RequestTable

// const TableStyle = styled(Table)`
// th {background: #1F386B; color:white;}
// tr{
//     cursor:pointer;
//     &:hover{
//         background: lightgray;
//     }
// }
// `;

// const Btn = styled(Button)`
// &:hover{
//     background: #0e8ccc;
// }

// `;

// const ModalBody = styled(Modal.Body)`

// li{
//     padding:5px;
// }

// `;