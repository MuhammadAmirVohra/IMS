import React , { useEffect, useState } from 'react';
import axios from 'axios';
import {Row,Table,Button,Container, Modal, Form} from 'react-bootstrap';
import MainHeader from '../header/Header_pages'
import moment from 'moment';
import { API_URL } from '../../utils/constant';
import "../style.css"


const ReturnItems = () => {
    const arr = ['Item Name', 'Department','Quantity','Duration','Date', ' ']
    const [items, setitems] = useState([])

    useEffect( () =>{
       
        async function fetch(){
       await axios.get(`${API_URL}/get_issued_records`, {
            withCredentials: true
        }).then((res)=>{
            console.log(res.data);
            
            setitems(res.data);
            
        })
    } 
    fetch()
    },[])


    const [showModal, setShow] = useState(false)
    const [ModalInfo, SetInfo] = useState({})
    const ModalContent = ()=>{
       
        const [quantity, setquantity] = useState(ModalInfo.Quantity)
        
        const UpdateRecord = (event)=>{
            event.preventDefault()
            
         axios.post(`${API_URL}/` + 'return_this_item'
         ,{ id : ModalInfo._id,  quantity : quantity })
             .then(
             (res) => {
                 setShow(false);
                 console.log(res) 
                 window.flash('Record Updated')
                 setitems(res.data);
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
                   <Form onSubmit = {UpdateRecord}>  
 
                     <Modal.Body className="ModalBody">
 
                 {/* <Form.Group>
                     <Form.Control type="text" value={name} placeholder = "Item Name" onChange={(event)=>{ setname(event.target.value)}} />
                 </Form.Group> */}
 
                 <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                     <Form.Control type="number" value={quantity} placeholder = "Returned Quantity" onChange={(event)=>{ setquantity(event.target.value) }} />
                 </Form.Group>
{/*                  
 
                 <Form.Group>
                     <Form.Control type="text" value={type} placeholder = "Item Type" onChange={ (event)=>{ settype(event.target.value) }} />
                 </Form.Group>
                 
 
                 <Form.Group>
                     <Form.Control type="text" value={description} placeholder = "Item Description" onChange={ (event)=>{ setdescription(event.target.value) }} />
                 </Form.Group>
*/}                 
                 </Modal.Body>

                  
                <Modal.Footer>
                    <Button type ="submit" className = "Btn btn-success">Update</Button>              
                </Modal.Footer>
                </Form>
            </Modal>
        );
        

    }
    
    const Dissmiss = (id)=>{
        axios.post(`${API_URL}/` + 'dissmiss_issue_record'
         ,{ id : id })
             .then(
             (res) => {
                 console.log(res) 
                 window.flash('Record Updated')
                 setitems(res.data);
             } 
         )
         
    }

    
    const [itemName, setItemName] = useState("")
    return(
        <>
        {showModal?
            <div>
                <ModalContent/>
            </div>
        :null   
        }

        
   
    <MainHeader/>
    
     
    <Container className="MainContainer">
        <Row className = "Row1">
     <h1>Issue Records</h1>

        </Row>
     <Row className="Row1 float-right" >
        
    <Form>
         
         <Form.Group className="FormGroup">
           
             <Form.Control type="text" placeholder="Search" name="searchbar" value={itemName} onChange={(event)=>{ setItemName(event.target.value)}} >
                 
            
             </Form.Control>
            
         </Form.Group>
         
    </Form>       
        
            
      
     
     
     </Row>
 
        
         { items.length > 0 &&
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
          {items.map((item, index) =>{
            if (item.Item_ID.Item_Name.toLowerCase().includes(itemName.toLowerCase()) )
            return(
            <>
           <tr>
                <td>{index+1}</td>
                <td>{item.Item_ID.Item_Name}<br/></td>
                <td>{item.Department}<br/></td>
                <td>{item.Quantity}</td>
                <td>{item.Duration}</td>
                <td>{moment(item.Date).format('Do MMMM YYYY')}</td>
                <td><Button className="Btn" onClick = {()=>{ SetInfo(item); setShow(true); }} >Returned</Button></td>
                <td><Button className="btn-danger" onClick = {()=>{ Dissmiss(item._id); }} >Dissmiss</Button></td>
                    
               
            </tr>
            
           
            </>
            )
          else return(<tr></tr>)
          
          
          })}
        </tbody>
      </Table>
      
      }
      {
          items.length === 0 && <h2>No Items.</h2>
      }
        
      </Container>
      </>
    )


}

export default ReturnItems;
