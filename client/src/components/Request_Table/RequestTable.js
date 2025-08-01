import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';
import moment from 'moment';

import { API_URL } from '../../utils/constant';
import '../style.css'
const RequestTable = () => {
    const [showModal, setShow] = useState(false);
    const arr = ['Request ID', 'Requested By', 'Email', 'Department', 'Date Requested', 'Item']
    const [allrequest, setrequests] = useState([])
    const interval_id = useRef(null);

    async function fetch() {
        console.log('in fetch', showModal);
        await axios.get(`${API_URL}/get_all_request`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data);
            //  if (showModal === false)
            setrequests(res.data);

        })
    }
    // var requests = []

    useEffect(() => {

        fetch()

        interval_id.current = setInterval(() => { fetch() }, 3000);
        return function cleanup() {
            clearInterval(interval_id.current);
        }
        // eslint-disable-next-line
    }, [])

    const [ModalInfo, SetInfo] = useState({})
    const ModalContent = () => {
        const [comment, setcomment] = useState("")

        const Approve = () => {
            console.log('Approve Request')
            axios.post(`${API_URL}/request_approve`, { id: ModalInfo._id, head_comment: comment }).then(
                (res) => {
                    if (res.data) {
                        window.flash('Request Approved')
                        setShow(false)
                        fetch()
                    }
                }
            )
        }


        const Reject = () => {
            axios.post(`${API_URL}/request_reject`, {
                id: ModalInfo._id,
                name: ModalInfo.R_Emp_Name,
                email: ModalInfo.R_Emp_Email,
                item: ModalInfo.Item,
                comment: comment
            }).then(
                (res) => {
                    if (res.data) {
                        window.flash('Request Rejected')
                        setShow(false)
                        fetch()
                    }
                }
            )
        }
        return (
            <Modal show={showModal} onHide={() => { fetch(); interval_id.current = setInterval(() => { fetch() }, 3000); setShow(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Details
                    </Modal.Title>
                </Modal.Header>
                <Form>

                    <Modal.Body className="ModalBody">
                        <ul className="list-unstyled">
                            <li><strong>Request ID:</strong> {ModalInfo.Order_ID}</li>
                            <li><strong>Requested by:</strong> {ModalInfo.R_Emp_Name}</li>
                            <li><strong>Email:</strong> {ModalInfo.R_Emp_Email}</li>
                            <li><strong>Department:</strong> {ModalInfo.R_Emp_Dept.Dept_Name}</li>
                            <li className="new-line"><strong>Item:</strong><br />{ModalInfo.Item}</li>
                            {/* <li><strong>Quantity:</strong> {ModalInfo.Quantity}</li>
                            <li><strong>Duration:</strong> {ModalInfo.Duration}</li> */}
                            {ModalInfo.Reason.length ? <li><strong>Reason:</strong> {ModalInfo.Reason}</li> : null}
                            <li className="mt-3">
                                <Form.Group>
                                    <Form.Label>Additional Comments (optional) : </Form.Label>
                                    <span style={{ color: 'gray', fontSize: 15, float: 'right' }}>Word Limit : {80 - comment.length} </span>
                                    <Form.Control as="textarea" value={comment} onChange={(e) => {
                                        if (e.target.value.length <= 80)
                                            setcomment(e.target.value);
                                    }} placeholder="Additional Comments" row={6} />
                                </Form.Group>

                            </li>
                        </ul>
                    </Modal.Body>


                    <Modal.Footer>
                        <Button className="Btn btn-success" onClick={() => { Approve() }}>Approve</Button>
                        <Button className="Btn btn-danger" onClick={Reject}>Reject</Button>

                    </Modal.Footer>
                </Form>
            </Modal>
        );


    }



    return (
        <>
            {showModal ?
                <div>
                    <ModalContent />
                </div>
                : null
            }



            <Container>
                {allrequest.length > 0 &&
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
                            {allrequest.map((request, index) => {
                                return (
                                    <>
                                        <tr onClick={() => { clearInterval(interval_id.current); SetInfo(request); setShow(true); }}>
                                            <td>{index + 1}</td>
                                            <td>{request.Order_ID}<br /></td>
                                            <td>{request.R_Emp_Name}<br /></td>
                                            <td>{request.R_Emp_Email}</td>
                                            <td>{request.R_Emp_Dept.Dept_Name}</td>
                                            <td>{moment(request.Added).format('Do MMMM YYYY')}</td>
                                            <td className="new-line">{request.Item}</td>
                                            {/* <td>{request.Quantity}</td>
                                            <td>{request.Duration}</td> */}

                                        </tr>


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
//         // background: #1F386B;
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