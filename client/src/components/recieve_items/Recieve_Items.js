import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Row, Table, Button, Container, Modal, Form } from 'react-bootstrap';
import styled from 'styled-components';
import MainHeader from '../header/Header_pages'
import moment from 'moment';
import { API_URL } from '../../utils/constant';
import '../style.css'
import { useHistory } from 'react-router-dom';

const RecieveItems = () => {
    const arr = ['Person Name', 'Item Name', 'Quantity', 'Requested Date']
    const [allRequests, setRequests] = useState([])
    const interval_id = useRef(null);
    const history = useHistory()
    async function fetch() {
        await axios.get(`${API_URL}/recieveitem`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data);

            setRequests(res.data);

        })
    }

    useEffect(() => {
        fetch()

        interval_id.current = setInterval(() => { fetch() }, 3000);
        return function cleanup() {
            clearInterval(interval_id.current);
        }
    }, [])


    const [showModal, setShow] = useState(false)
    const [ModalInfo, SetInfo] = useState({})
    const ModalContent = () => {

        const [name, setname] = useState("")
        const [quantity, setquantity] = useState("")
        const [description, setdescription] = useState("")
        const [type, settype] = useState("")

        const UpdateRecord = (event) => {
            event.preventDefault()

            axios.post(API_URL + '/recieveitem'
                , { id: ModalInfo._id, name: name, quantity: quantity, description: description, type: type })
                .then(
                    (res) => {
                        setShow(false);
                        console.log(res)
                        window.flash('Record Updated')
                        history.push('/storedashboard')
                        // fetch()
                    }
                )

        }



        return (
            <Modal show={showModal} onHide={() => {
                fetch();
                interval_id.current = setInterval(() => { fetch() }, 3000);
                setShow(false)
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add Item
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={UpdateRecord}>

                    <Modal.Body className="ModalBody">

                        <Form.Group>
                            <Form.Control type="text" value={name} placeholder="Item Name" onChange={(event) => { setname(event.target.value) }} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Control type="number" value={quantity} placeholder="Item Quantity" onChange={(event) => { setquantity(event.target.value) }} />
                        </Form.Group>


                        <Form.Group>
                            <Form.Control type="text" value={type} placeholder="Item Type" onChange={(event) => { settype(event.target.value) }} />
                        </Form.Group>


                        <Form.Group>
                            <Form.Control type="text" value={description} placeholder="Item Description" onChange={(event) => { setdescription(event.target.value) }} />
                        </Form.Group>

                    </Modal.Body>


                    <Modal.Footer>
                        <Button type="submit" className="Btn btn-success">Add to the Inventory</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );


    }



    const [itemName, setItemName] = useState("")
    return (
        <>
            {showModal ?
                <div>
                    <ModalContent />
                </div>
                : null
            }



            <MainHeader />


            <Container className="MainContainer">
                <Row className="Row1">
                    <h1>Receive Items</h1>
                </Row>
                <Row className="Row1 float-right" >

                    <Form>

                        <FormGroup>

                            <Form.Control type="text" placeholder="Search" name="searchbar" value={itemName} onChange={(event) => { setItemName(event.target.value) }} >


                            </Form.Control>

                        </FormGroup>

                    </Form>





                </Row>


                {allRequests.length > 0 &&
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
                            {allRequests.map((request, index) => {
                                if (request.Item.toLowerCase().includes(itemName.toLowerCase()))
                                    return (
                                        <>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{request.R_Emp_Name}<br /></td>
                                                <td>{request.Item}</td>
                                                <td>{request.Quantity}</td>
                                                <td>{moment(request.Added).format('Do MMMM YYYY')}</td>
                                                <td><Button className="Btn" onClick={() => { clearInterval(interval_id.current); SetInfo(request); setShow(true); }} >Received</Button></td>


                                            </tr>


                                        </>
                                    )
                                else return (<tr></tr>)


                            })}
                        </tbody>
                    </Table>

                }
                {
                    allRequests.length === 0 && <h2>No Requests.</h2>
                }

            </Container>
        </>
    )


}

export default RecieveItems;

// const Row1 = styled(Row)`
//     padding:100px 16px 0px 0px;



// `;
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

// const ModalBody = styled(Modal.Body)`

// li{
//     padding:5px;
// }

// `;


const FormGroup = styled(Form.Group)`
display : flex

`;