import React, { useState } from 'react';
import 'react-bootstrap'
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

import axios from 'axios';
import { API_URL } from '../../utils/constant';
import "../style.css"
const RequestForm = () => {
    // const Auth = React.useContext(AuthApi);
    // const history = useHistory();
    const [items, setitems] = useState([{ item: "", quantity: undefined }])
    const [request, setRequest] = useState({
        Name: "",
        email: "",
        itemname: "",
        qty: "",
        duration: "",
        reason: ""
    });

    // Functions

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...items];

        list[index][name] = value;

        console.log(list)
        setitems(list);

    };
    const handleRemoveClick = index => {
        const list = [...items];
        list.splice(index, 1);
        setitems(list);
    };

    const handleAddClick = () => {
        setitems([...items, { item: "", quantity: undefined }]);
    };
    const onChangeHandle = (e) => {
        const value = e.target.value;
        // console.log(value);
        setRequest({
            ...request,
            [e.target.name]: value
        });
    }

    const Item_Join = () => {
        var item_string = ""
        for (let i = 0; i < items.length; i++) {
            item_string += items[i].item + " (Qty - " + items[i].quantity + ")\n"
        }

        return item_string;

    }


    const onSubmit = (event) => {

        event.preventDefault()
        axios({
            method: "POST",
            data: {
                R_Emp_Name: request.Name,
                R_Emp_Email: request.email,
                Item: Item_Join(),
                Quantity: request.qty,
                Duration: request.duration,
                Reason: request.reason
            },
            withCredentials: true,
            url: `${API_URL}/add_request`,
        }).then((res) => {
            console.log(res.data);
            if (res.data) {
                console.log(res.data)
                window.flash('Request Forwarded\nRequest ID : ' + res.data.Order_ID);
                setRequest({
                    Name: "",
                    email: "",
                    itemname: "",
                    qty: "",
                    duration: "",
                    reason: ""
                })
                setitems([{ item: "", quantity: undefined }]);
            }
            else {
                console.log('No user found')
            }
        })
    };


    return (
        <>

            <Container className="MainContainer mt-4 d-flex justify-content-left align-items-left">
                <Row>
                    <Col className="text-left">
                        <Form className="FormStyle" onSubmit={onSubmit} >
                            <Form.Group >
                                <Form.Label>Name : </Form.Label>
                                <Form.Control placeholder="Enter Name" onChange={onChangeHandle} type="text" name="Name" value={request.Name} required />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Email : </Form.Label>
                                <Form.Control placeholder="Enter Email" onChange={onChangeHandle} type="email" name="email" value={request.email} required />
                            </Form.Group>
                            {/* <Form.Group >
                                <Form.Label>Item : </Form.Label>
                                <Form.Control placeholder="Enter Item Name" onChange={onChangeHandle} type="text" name="itemname" value={request.itemname} />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Quantity : </Form.Label>
                                    <Form.Control placeholder="Enter Quantity" onChange={onChangeHandle} type="number" name="qty" value={request.qty} />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Duration : </Form.Label>
                                    <Form.Control placeholder="Enter Duration" onChange={onChangeHandle} type="text" name="duration" value={request.duration} />
                                </Form.Group>
                            </Form.Row> */}
                            <h4 className="mb-5">Item :
                                <Button onClick={handleAddClick} className="float-right btn-success m-2">+</Button>

                            </h4>

                            {items.map((x, i) => {
                                return (
                                    <Form.Group className="FormGroup">
                                        <Form.Control
                                            required
                                            // className="ml-3 w-50"
                                            type="text"
                                            name="item"
                                            placeholder="Item Name"
                                            value={x.item}
                                            onChange={e => handleInputChange(e, i)}
                                        />



                                        <Form.Control
                                            required
                                            className="ml-3"
                                            type="Number"
                                            name="quantity"
                                            placeholder="Quantity"
                                            value={x.quantity}
                                            onChange={e => handleInputChange(e, i)}
                                        />

                                        {items.length !== 1 && <Button
                                            className="ml-3 btn-danger"
                                            onClick={() => handleRemoveClick(i)}>X</Button>}
                                        {/* {items.length - 1 === i && <Button onClick={handleAddClick} className="ml-3 btn-success">+</Button>} */}

                                    </Form.Group>

                                )
                            })}


                            <Form.Group>
                                <Form.Label>Reason : </Form.Label>
                                <Form.Control placeholder="Elaborate Reason(Optional)" as="textarea" rows={4} onChange={onChangeHandle} type="text" name="reason" value={request.reason} />
                            </Form.Group>
                            <Form.Group className="text-right">
                                {/* <a href="#"> Forgot Email ? </a> */}
                                <Button type="submit" className="Btn btn btn-md btn-success">Submit</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )

};



export default RequestForm;

// const FormStyle = styled(Form)`
//     background-color: white;
//     width: 500px;
//     .form-group{
//         &:hover{

//         }
//     }

// `;

// const MainContainer = styled(Container)`
//     width: 100%;
//   height: 100vh;
//   min-height: 100%;
//   min-height: 100vh;
// `;
// const Submit = styled(Button)`
//     background :#EFBB20;
//     border: none;
//     &:hover{
//     background: #0e8ccc;
// }
// `;