import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Tab, Tabs, Container, Row } from 'react-bootstrap';
// import { Tabs, Tab } from 'react-bootstrap-tabs';
// import { useHistory } from 'react-router-dom';
import { API_URL } from '../../utils/constant';

const RequestTable = () => {
    const arr = ['Request ID', 'Requested By', 'Email', 'Department', 'Item Name', 'Options', ' ']
    const [allrequest, setrequests] = useState([])
    const [allissued, setissued] = useState([])
    const [allreceive, setreceive] = useState([])

    const interval_id = useRef(null);
    // const history = useHistory()
    async function fetch() {
        await axios.get(`${API_URL}/storerequests`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data);
            setrequests(res.data.requests);
            setissued(res.data.issued);
            setreceive(res.data.receive);




        })
    }
    const onIssue = (id) => {

        console.log("STORE TABLE MAIN ID FOR PARAMS", id)
        axios.post(`${API_URL}/request_issued`, { id: id }).then(
            (res) => {
                if (res.data) {
                    // setShow(false)
                    window.flash('Request Issued');
                    fetch();
                }
            }
        )
        // history.push('/issuenote');
    }


    const onPurchase = (id) => {
        axios.post(`${API_URL}/request_forward_purchase`, { id: id }).then(
            (res) => {
                if (res.data) {
                    // setShow(false)
                    window.flash('Request Forwarded to Purchase Department')
                    fetch();
                }
            }
        )

    }

    const onCancel = (_id, email, name, item) => {
        axios.post(`${API_URL}/request_cancel`, { id: _id, email: email, name: name, item: item }).then(
            (res) => {
                if (res.data) {
                    window.flash('Request Cancelled');
                    fetch();

                }
            }
        )
    }

    const OnReturn = (_id, email, name, item) => {
        axios.post(`${API_URL}/return_this_item`, { id: _id, email: email, name: name, item: item }).then(
            (res) => {
                if (res.data) {
                    window.flash('Request Returned');
                    fetch();

                }
            }
        )
    }
    const OnReceived = (_id, email, name, item) => {
        axios.post(`${API_URL}/receive_this_item`, { id: _id, email: email, name: name, item: item }).then(
            (res) => {
                if (res.data) {
                    window.flash('Request Recieved');
                    fetch();

                }
            }
        )
    }

    const OnDissmiss = (_id, email, name, item) => {
        axios.post(`${API_URL}/dissmiss_this_item`, { id: _id, email: email, name: name, item: item }).then(
            (res) => {
                if (res.data) {
                    window.flash('Request Dissmissed');
                    fetch();

                }
            }
        )
    }
    // var requests = []
    useEffect(() => {
        fetch()

        interval_id.current = setInterval(() => { fetch() }, 3000);
        return function cleanup() {
            clearInterval(interval_id.current);
        }
    }, [])


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
    const [key, setkey] = useState('Issue')


    return (
        <>
            {/* {showModal?
            <div>
                <ModalContent/>
            </div>
        :null
        } */}
            <Container className="MainContainer">
                <Tabs

                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={key => setkey(key)}
                >
                    <Tab eventKey="Issue" title={"Issue Requests (" + allrequest.length + ")"}>



                        {
                            allrequest.length > 0 &&
                            <>
                                {/* <h1>Issue Request</h1> */}
                                <Table className="w-100 TableStyle" responsive>
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
                                        {allrequest.map((request, index) => {
                                            return (
                                                <>
                                                    {/* <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Click to see Details</Tooltip>} > */}
                                                    {/* <tr key={index} onClick={() => { onIssue(request._id) }}> */}
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{request.Order_ID}<br /></td>
                                                        <td>{request.R_Emp_Name}<br /></td>
                                                        <td>{request.R_Emp_Email}</td>
                                                        <td>{request.R_Emp_Dept.Dept_Name}</td>
                                                        <td className="new-line">{request.Item}</td>
                                                        {/* <td>{request.Quantity}</td>
                                        <td>{request.Duration}</td> */}

                                                        <td>
                                                            <Row>
                                                                <Button onClick={() => { onPurchase(request); }} className="Btn m-2"> Send to Purchase </Button>
                                                            </Row><Row>
                                                                <Button onClick={() => onIssue(request._id)} className="m-2 btn-success mr-1">Issue</Button>
                                                                <Button onClick={() => onCancel(request._id, request.R_Emp_Email, request.R_Emp_Name, request.Item)} className="m-2 btn-danger">Cancel</Button>
                                                            </Row>
                                                        </td>
                                                    </tr>
                                                    {/* </OverlayTrigger> */}

                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </>
                        }
                        {/* {
                allrequest.length === 0 && <h2>No Requests.</h2>
            } */}
                    </Tab>
                    <Tab eventKey="Return" title={"Return Requests (" + allissued.length + ")"}>




                        {allissued.length > 0 &&
                            <>
                                {/* <h1>Return Request</h1> */}

                                <Table className="w-100 TableStyle" responsive>
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
                                        {allissued.map((request, index) => {
                                            return (
                                                <>
                                                    {/* <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Click to see Details</Tooltip>} > */}
                                                    {/* <tr key={index} onClick={() => { onIssue(request._id) }}> */}
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{request.Order_ID}<br /></td>
                                                        <td>{request.R_Emp_Name}<br /></td>
                                                        <td>{request.R_Emp_Email}</td>
                                                        <td>{request.R_Emp_Dept.Dept_Name}</td>
                                                        <td className="new-line">{request.Item}</td>
                                                        {/* <td>{request.Quantity}</td>
                                        <td>{request.Duration}</td> */}

                                                        <td>
                                                            <Button onClick={() => OnReturn(request._id)} className="m-2 btn-success mr-1">Returned</Button>
                                                            <Button onClick={() => OnDissmiss(request._id)} className="m-2 mr-1 btn-danger">Dissmiss</Button>
                                                        </td>
                                                    </tr>
                                                    {/* </OverlayTrigger> */}

                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </>
                        }
                        {/* {
                allissued.length === 0 && <h2>No Requests.</h2>
            } */}
                    </Tab>
                    <Tab eventKey="Receive" title={"Receive Requests (" + allreceive.length + ")"}>





                        {allreceive.length > 0 &&
                            <>
                                {/* <h1>Receive Request</h1> */}

                                <Table className="w-100 TableStyle" responsive>
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
                                        {allreceive.map((request, index) => {
                                            return (
                                                <>
                                                    {/* <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Click to see Details</Tooltip>} > */}
                                                    {/* <tr key={index} onClick={() => { onIssue(request._id) }}> */}
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{request.Order_ID}<br /></td>
                                                        <td>{request.R_Emp_Name}<br /></td>
                                                        <td>{request.R_Emp_Email}</td>
                                                        <td>{request.R_Emp_Dept.Dept_Name}</td>
                                                        <td className="new-line">{request.Item}</td>
                                                        {/* <td>{request.Quantity}</td>
                                        <td>{request.Duration}</td> */}

                                                        <td>
                                                            <Button onClick={() => OnReceived(request._id)} className="m-2 btn-success mr-1">Received</Button>
                                                            <Button onClick={() => OnDissmiss(request._id)} className="m-2 mr-1 btn-danger">Dissmiss</Button>
                                                        </td>
                                                    </tr>
                                                    {/* </OverlayTrigger> */}

                                                </>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </>
                        }
                        {/* {
                        allreceive.length === 0 && <h2>No Requests.</h2>
                    } */}

                    </Tab>
                </Tabs>
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