import axios from 'axios';
import {Button, Card, Form, Col, Container} from 'react-bootstrap'
import '../style.css'
import HeaderPages from '../header/Header_pages';
const StockReport = () =>{

return(
    <>
    <HeaderPages />
    <Container className='Container_Date'>
        <h1>Stock Report</h1>
        <Form>
            <Form.Row>
                    <Form.Group as = {Col} className = "mt-4"  >
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type = "Date" required/>
                    </Form.Group>
                    
                    <Form.Group as = {Col} className = "mt-4" >
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type = "Date" required/>
                    </Form.Group>
                
                <Form.Group as = {Col} className = "mt-4">
                <Button className = "Btn Date_Button ml-2" type = 'Submit'>Generate</Button>
                </Form.Group>

            </Form.Row>
        </Form>
    </Container>

    </>
)


}

export default StockReport;

