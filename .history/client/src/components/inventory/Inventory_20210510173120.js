import React , { useEffect, useState } from 'react';
import axios from 'axios';
import {Row,Table,Button,Container, Modal, Form} from 'react-bootstrap';
import styled from 'styled-components';
import MainHeader from '../header/Header_pages'
import { API_URL } from '../../utils/constant';
import "../style.css"


const Inventory = () => {
    const arr = ['Name','Type','Description','Quantity']
    const [items, setitems] = useState([])

    useEffect( () =>{
       
        async function fetch(){
       await axios.get(`${API_URL}/storeitem`, {
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
       
        const [name, setname] = useState(ModalInfo.Item_Name)
        const [quantity, setquantity] = useState(ModalInfo.Item_Quantity)
        const [description, setdescription] = useState(ModalInfo.Item_Description)
        const [type, settype] = useState(ModalInfo.Item_Type)
 
        const UpdateRecord = (event)=>{
            event.preventDefault()
            
         axios.post(`${API_URL}/` + ModalInfo._id + '/updateitem'
         ,{ id : ModalInfo._id, name : name, quantity : quantity, description : description, type : type })
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
 
                     <ModalBody>
 
                 <Form.Group>
                     <Form.Control type="text" value={name} placeholder = "Item Name" onChange={(event)=>{ setname(event.target.value)}} />
                 </Form.Group>
 
                 <Form.Group>
                     <Form.Control type="number" value={quantity} placeholder = "Item Quantity" onChange={(event)=>{ setquantity(event.target.value) }} />
                 </Form.Group>
                 
 
                 <Form.Group>
                     <Form.Control type="text" value={type} placeholder = "Item Type" onChange={ (event)=>{ settype(event.target.value) }} />
                 </Form.Group>
                 
 
                 <Form.Group>
                     <Form.Control type="text" value={description} placeholder = "Item Description" onChange={ (event)=>{ setdescription(event.target.value) }} />
                 </Form.Group>
                 
                 </ModalBody>
 
                  
                <Modal.Footer>
                    <Button type ="submit" className = "Btn btn-success">Update</Button>              
                </Modal.Footer>
                </Form>
            </Modal>
        );
        

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
        <Row1>
     <h1>Store Inventory</h1>

        </Row1>
     <Row1 className="float-right" >
        
    <Form>
         
         <FormGroup>
           
             <Form.Control type="text" placeholder="Search" name="searchbar" value={itemName} onChange={(event)=>{ setItemName(event.target.value)}} >
                 
            
             </Form.Control>
            
         </FormGroup>
         
    </Form>       
        
            
      
     
     
     </Row1>
 
        
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
            if (item.Item_Name.toLowerCase().includes(itemName.toLowerCase()) || item.Item_Description.toLowerCase().includes(itemName.toLowerCase()) )
            return(
            <>
           <tr>
                <td>{index+1}</td>
                <td>{item.Item_Name}<br/></td>
                <td>{item.Item_Type}</td>
                <td>{item.Item_Description}</td>
                <td>{item.Item_Quantity}</td>
                <td><Button className="Btn" onClick = {()=>{ SetInfo(item); setShow(true); }} >Update</Button></td>
                    
               
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

export default Inventory;

const Row1 = styled(Row)`
    padding:100px 16px 0px 0px;
    


`;
// const MainContainer = styled(Container)`
//     width: 100%;
//   height: auto;
//   min-height: 100%;
//   min-height: 100vh;
// `;
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
// background :#EFBB20;
// margin-left : 10px;
// border: none; 
// &:hover{
// background: #0e8ccc;
// }
// `;

const ModalBody = styled(Modal.Body)`

li{
    padding:5px;
}

`;


const FormGroup = styled(Form.Group)`
display : flex

`;