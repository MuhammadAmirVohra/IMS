import axios from 'axios';
import {Button, Table, Form, Col, Container} from 'react-bootstrap'
import '../style.css'
import HeaderPages from '../header/Header_pages';
import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/constant';


const ProductLedger = () =>{

const [start_Date , set_Start_Date] = useState();
const [Product , set_Product] = useState();
const [end_Date , set_End_Date] = useState();
const [allitems , setallitems] = useState([]);

const arr = ['Date', 'Quantity', 'Duration', 'Status', 'Department']



useEffect(() => {
    axios.get(`${API_URL}/retreive-items`).then((res)=>{
        if(res.data.code == 200)
        {
            setallitems(res.data.items)
            console.log(res.data.items)
        }
        else
        {
            setallitems([])
        }
    })
}, [])






const [allRecords, setRecords] = useState();

const Pdf = async()=>{

    fetch(`${API_URL}/productledgerpdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product : Product, 
            data : allRecords
        }),
      }).then(async res => {
        if (res.status === 200) {
          const blob = await res.blob();
          const file = new Blob(
            [blob], 
            {type: 'application/pdf'},
            {name : 'report.pdf'}
          );
          console.log(file)
          
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          console.log(fileURL)
        //   download(res.data, details.request.Item + '_report', 'pdf');
          window.open(fileURL);  
        }
      })
}

const Submit = (event) => {
    event.preventDefault();
    axios.post(`${API_URL}/generateproductledger`, { start_date : start_Date, product : Product, end_date : end_Date }).then((res)=>{
        if(res.data.code == 200)
        {
            setRecords(res.data.records);
        }
        else
        {
            setRecords([]);
        }
})
}




return(
    <>
    <HeaderPages />
    <Container className='Container_Date text-center justify-content-center'>
        <h1>Product Ledger</h1>
        <Form  onSubmit = {Submit} className = "d-flex justify-content-center">
            <Form.Row>
                    <Form.Group as = {Col} className = "mt-4"  >
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type = "Date" value = {start_Date} onChange = {(e)=> {set_Start_Date(e.target.value)}} required />
                    </Form.Group>
                    
                    <Form.Group as = {Col} className = "mt-4"  >
                    <Form.Label>Product</Form.Label>
                    <Form.Control as = "select" className = "selectstyle" onChange = {(e)=> {set_Product(e.target.value)}} required>
                    <option disabled selected>-</option>
                    {   
                        allitems.map((item,index) =>{
                            return(
                                <option>{item}</option>
                            )
                        })
                    }
                    </Form.Control>    
                    </Form.Group>
                    
                    <Form.Group as = {Col} className = "mt-4" >
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type = "Date" value = {end_Date} onChange = {(e)=> {set_End_Date(e.target.value)}} required/>
                    </Form.Group>
                
                <Form.Group as = {Col} className = "mt-4">
                <Button className = "Btn Date_Button ml-2" type = 'Submit'>Find</Button>
                </Form.Group>

            </Form.Row>
        </Form>
   

    {allRecords && <>
    {allRecords.length > 0 &&
        <>
        <Button className = "Btn Date_Button ml-2" onClick = {Pdf}>Generate PDF Report</Button>
        <Table className="TableStyle mt-3 justify-content-center" responsive>
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
                {allRecords.map((record, index) => {
                        return (
                            <>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{record[0]}</td>
                                    <td>{record[1]}<br /></td>
                                    <td>{record[2]}</td>
                                    <td>{record[3]}</td>
                                    <td>{record[4]}</td>
                             

                                </tr>


                            </>
                        )
                    

                })}
            </tbody>
        </Table>
        </>
    }
    {
        allRecords.length === 0 && <h2>No Records.</h2>
    }
   </> }

    </Container>
    </>

)


}

export default ProductLedger;

