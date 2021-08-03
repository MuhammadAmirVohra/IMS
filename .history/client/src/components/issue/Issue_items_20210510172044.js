import React , { useEffect, useState } from 'react';
import axios from 'axios';
import {Row,Table,Button,Container, Modal, Form, Card} from 'react-bootstrap';
import styled from 'styled-components';
import MainHeader from '../header/Header_pages';
import { useParams, useHistory } from 'react-router';
import { API_URL } from '../../utils/constant';

// import { func } from 'prop-types';


const IssueItems = () => 
{
    const history = useHistory();
    const arr = ['Name','Type','Description','Quantity']
    // const [items, setitems] = useState([])

    const {id} = useParams();
  
        
    const [requested,setRequested] = useState({
    })
    const [iName, setItemName] = useState("")
    const [inventory,setInventory] = useState([])
    async function fetch()
       { 
            await axios.get(`${API_URL}/` +id+ '/issuerequest', {
                withCredentials: true
        }).then((res)=>{
            
            console.log("IN ISSUE_ITEMS.JS BLABLA",res.data); 
            if(res.data.code === 404)
            {
                history.push('/storedashboard')
            }
            else if (res.data.code === 200)
            {   
                console.log(res.data)
                setRequested(res.data.requested_item);
                setInventory(res.data.inventory_items);
                setItemName(res.data.requested_item.Item);
            }
            
           // // // // // // // check quantity update wali cheez main try kr rahi thi didnt get
        })
       }
   

    const onPurchase = ()=>{
        axios.post(`${API_URL}/request_forward_purchase`, { id : id}).then(
            (res)=>{
                if(res.data)
                { 
                    setShow(false)
                    console.log("Request Forwarded to Purchase Department")
                    window.flash('Request Forwarded to Purchase Department')
                    history.push('/storedashboard');
                }
            }
        )

    }
        
    const onCancel = (_id, email, name, item) => {
        axios.post(`${API_URL}/request_cancel`, {id : _id, email : email, name : name, item : item}).then(
            (res)=>{
                if(res.data)
                { 
                    window.flash('Request Cancelled');
                    fetch();
                    history.push('/storedashboard');
                }
            }
        )
    }

    

    useEffect( () =>{
       fetch()
  
    },[])
    // /////////////////////////////////////////////////
    const [showModal, setShow] = useState(false)
    const [ModalInfo, SetInfo] = useState({})
    const [item_id, set_item_id] = useState("")
    const ModalContent = ()=>{
       
        const [name, setname] = useState(ModalInfo.Item_Name)
        const [quantity, setquantity] = useState(ModalInfo.Item_Quantity)
        const [description, setdescription] = useState(ModalInfo.Item_Description)
        const [type, settype] = useState(ModalInfo.Item_Type)
 
        const UpdateRecord = (event,q)=>{
            // event.preventDefault() oyeeee abbb bass bhot hogaya ... commit karo aur so jao 
            console.log('Quantity : ', ModalInfo.Item_Quantity - Quantity)     
         axios.post(`${API_URL}/issued_item`,
         { quantity : Quantity, request_id : requested._id,  item_id: item_id})
             .then(
             (res) => {
                 setShow(false);
                 console.log(res);
                 if (res.data.code === 404)
                 {
                    window.scrollTo(0, 0)
                     window.flash('Item Quantity Invalid', 'danger')
                 }
                 else if (res.data.code === 200)
                 { 
                    window.scrollTo(0, 0)
                     window.flash('Item Successfully Issued ')
                     history.push('/storedashboard');
                 }  
                //  setRequested(res.data);
              
             } 
         )
         
        }
            
        const [Quantity, setQuantity] = useState(0)

        
        
         return(
             <Modal show = {showModal} onHide ={() => {setShow(false)}}>
                 <Modal.Header closeButton>
                     <Modal.Title>
                         Details 
                     </Modal.Title>
                     </Modal.Header>
                <ModalBody>
             
                <h5><strong>Requested Item Information</strong></h5>
                <p>Item Name: {requested.Item}</p>
                <p>Quantity Requested: {requested.Quantity}</p>
                <p>Duration of Request: {requested.Duration}</p>

                <h5><strong>Inventory Information</strong></h5> 
                <p>Item Name: {ModalInfo.Item_Name}</p> 
                <p>Quantity Available: {ModalInfo.Item_Quantity}</p> 
                
                <p><strong>Set Issue Quantity</strong></p> 
               
                <Form>
                    <Form.Control type="number" value = {Quantity} onChange={(event)=>{setQuantity(event.target.value)}}  />    
                </Form>

                </ModalBody>
                 <Modal.Footer>
                    <Btn onClick={()=>UpdateRecord(ModalInfo.Item_Quantity - Quantity)} type ="submit" className = "btn-success">Issue</Btn>              
                </Modal.Footer>
               
            </Modal>
        );
        

    }
    

 
   

    return(
        <>
        
         {     showModal?
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
            <Row1>
                <Card>
                <Card.Header>Requested Item Information</Card.Header>
                <Card.Body>
                <Card.Title>Item Name: {requested.Item}</Card.Title>
                <Card.Title>Quantity Requested: {requested.Quantity}</Card.Title>
                <Card.Title>Duration of Request: {requested.Duration}</Card.Title>
                </Card.Body>
                {/* <Btn onClick = {() => {SetInfo(request); setShow(true);} } className = "mr-1"> Details </Btn> */}
                {/* <Btn onClick={()=>onIssue(request._id)} className = "btn-success mr-1">Issue</Btn> */}
                <Card.Footer>
                <Button  className="Btn btn-success" onClick= {() => {onPurchase()}}>Send To Purchase Department</Button>
                <Button className = "Btn" onClick={()=>onCancel(requested._id, requested.R_Emp_Email, requested.R_Emp_Name, requested.Item)} className="btn-danger">Cancel</Button>
                </Card.Footer></Card>
            </Row1>
            <Row1 className="float-right" >
        
        <Form>
             
             <FormGroup>
                    
                <FormLabel>Search </FormLabel>  
                 <Form.Control type="text" placeholder="Search" name="searchbar" value={iName} onChange={(event)=>{ setItemName(event.target.value)}} />
                 
                
              
                
             </FormGroup>
             
        </Form>       
            
                
          
         
         
         </Row1>
     
            { 
                inventory.length > 0 &&
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
                {
                    inventory.map((item, index) => {
                        if (item.Item_Name.toLowerCase().includes(iName.toLowerCase()) || item.Item_Description.toLowerCase().includes(iName.toLowerCase()) )
                        return(
                        
                        <>
                        <tr>
                            <td>{index+1}</td>
                            <td>{item.Item_Name}<br/></td>
                            <td>{item.Item_Type}</td>
                            <td>{item.Item_Description}</td>
                            <td>{item.Item_Quantity}</td> 
                            <td><Button className="Btn" onClick = {()=>{ SetInfo(item); set_item_id(item._id); setShow(true); }} >Confirm Issue</Button></td>
                                
               
                        </tr>
            
           
                        </>
                    )
                    // else return(<tr></tr>)

                    }
                    )
                }
            </tbody>
      
            </Table>
      
            }

            {
                inventory.length === 0 && <h2 className="mt-2">No Items.</h2>
            }
        
            
        </Container>
        
        </>
    )


}

export default IssueItems;

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
    padding:10px;
}

`;


const FormGroup = styled(Form.Group)`
display : flex

`;


const FormLabel = styled(Form.Label)`
font-size : 25px

`;