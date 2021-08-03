import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
// import styled from 'styled-components';
import { useHistory } from 'react-router';
import { API_URL } from '../../utils/constant';
// import Cookie from 'universal-cookie';
import '../style.css'
import HeaderPages from '../header/Header_pages';


const PrevReqs = () => {
    const arr = ['Request ID', 'Requested By', 'Email', 'Date Requested', 'Department', 'Item']
    const [allrequest, setrequests] = useState([])
    const history = useHistory()

    useEffect(() => {
        axios.get(`${API_URL}/get_completed_requests`, {
            withCredentials: true
        }).then((res) => {
            console.log(res.data);

            setrequests(res.data);

        })

    }, [])


    const OpenNewPage = (id) => {


        history.push('/' + id + '/recordinfo')

    }



    return (
        <>
            <HeaderPages />

            <Container className="MainContainer">
                <h1>Previous Records</h1>
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
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-2">Click to see Details</Tooltip>} >

                                            <tr onClick={() => {
                                                OpenNewPage(request._id)

                                            }}>
                                                <td>{index + 1}</td>
                                                <td>{request.Order_ID}<br /></td>
                                                <td>{request.R_Emp_Name}<br /></td>
                                                <td>{request.R_Emp_Email}</td>
                                                <td>{moment(request.Added).format('Do MMMM YYYY')}</td>
                                                <td>{request.R_Emp_Dept.Dept_Name}</td>
                                                <td className="new-line" >{request.Item}</td>
                                                {/* <td>{request.Quantity}</td>
                    <td>{request.Duration}</td> */}

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

export default PrevReqs;