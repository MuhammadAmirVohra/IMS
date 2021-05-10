import React , { useEffect, useState } from 'react';
import axios from 'axios';
import {Table,Container,OverlayTrigger,Tooltip} from 'react-bootstrap';
import moment from 'moment';
import styled from 'styled-components';
import {useHistory} from 'react-router';
import { API_URL } from '../../utils/constant';
import Cookie from 'universal-cookie';
import '../style.css' 

const AdminRequestTable = () => {
    const cookie = new Cookie();
    const arr = ['Requested By','Email','Date Requested','Item Name','Quantity','Duration']
    const [allrequest, setrequests] = useState([])
    


    async function fetch(){
        await axios.get(`${API_URL}/get_accounts_requests`, {
             withCredentials: true
         }).then((res)=>{
             console.log(res.data);
             
             setrequests(res.data);
             
         })
    }
    useEffect( () =>{
    fetch()
        
    
     
    },[])
 
    const history = useHistory() 
    const OpenNewPage = (id) => {
        
        // var Role = localStorage.getItem('user');
        var Role = cookie.get('user');
        if (Role === 'Admin')
        history.push('/' + id + '/adminrequest')
        else if (Role === 'Director')
        history.push('/' + id + '/directorrequest')
        else
        history.push('/' + id + '/accountsrequest')
      
    }


    return(
        <>
     

     <Container>
         { allrequest.length > 0 &&
        <Table className="TableStyle" responsive>
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
            <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Click to see Details</Tooltip>} >
            
            <tr onClick =  {()=>{ 
                OpenNewPage(request._id)

            }}>
                <td>{index+1}</td>
                <td>{request.R_Emp_Name}<br/></td>
                <td>{request.R_Emp_Email}</td>
                <td>{moment(request.Added).format('Do MMMM YYYY')}</td>
                <td>{request.Item}</td>
                <td>{request.Quantity}</td>
                <td>{request.Duration}</td>
                
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


export default AdminRequestTable

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