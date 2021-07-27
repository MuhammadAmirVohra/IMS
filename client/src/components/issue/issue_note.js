import React, { useEffect, useState } from "react";
import axios from "axios";
import {

    Button,
    Container,
    Form

} from "react-bootstrap";
import moment from "moment";
import MainHeader from "../header/Header_pages";
import { useHistory } from "react-router";
// import FloatingLabel from "react-bootstrap-floating-label";
import { API_URL } from "../../utils/constant";
import "../style.css";


const IssueNote = () => {

    const history = useHistory();
    const [allitems, setallitems] = useState([]);
    const [requests, setrequests] = useState([]);

    useEffect(() => {

        axios.get(API_URL + '/storeitemissue').then(res => {
            console.log("data", res.data);
            setallitems(res.data.items);
            setrequests(res.data.requests);

        });


    }, []);

    function validation() {
        console.log(items);
        if (department === undefined || department === '' || date === undefined || date === '') {

            return true;
        }
        for (let i = 0; i < items.length; i++) {
            console.log(items[i]);
            if (items[i].item === undefined || items[i].quantity === undefined) {
                console.log('here');
                return true;
            }
        }
        return false;
    }


    const [date, setdate] = useState(moment(Date.now()).format('YYYY-MM-DD'));
    const [department, setdepartment] = useState();
    const [items, setitems] = useState([{ item_number: undefined, item: undefined, quantity: undefined, index: undefined, reason: undefined, item_id: undefined }]);
    const [request_id, setrequestid] = useState(null);
    const [req_id, setreqid] = useState(null);

    const PDF = () => {
        if (validation()) {
            console.log('Values Missing!')

            alert('Values Missing!')
        } else {
            fetch(API_URL + '/issue_note_pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items,
                    department: department,
                    date: date,
                    request_id: req_id
                }),
            }).then(async res => {
                if (res.status === 200) {
                    const blob = await res.blob();
                    const file = new Blob(
                        [blob],
                        { type: 'application/pdf' },
                        { name: 'report.pdf' }
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
    }

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...items];

        list[index][name] = value;
        list[index].index = allitems.map(e => e.Item_ID.Item_Name).indexOf(e.target.value);
        list[index].item_id = allitems[allitems.map(e => e.Item_ID.Item_Name).indexOf(e.target.value)].Item_ID._id;
        list[index].item_number = allitems[allitems.map(e => e.Item_ID.Item_Name).indexOf(e.target.value)].Item_ID.Item_ID;

        console.log(list)
        setitems(list);

    };

    const handleInputChangereason = (e, index) => {
        // const { value } = e.target;
        const list = [...items];

        list[index].reason = e.target.value;
        console.log(list)

        setitems(list);

    };
    const handleInputChangequantity = (e, index) => {
        let { value, min, max } = e.target;
        value = Math.max(Number(min), Math.min(Number(max), Number(value)));
        const list = [...items];
        list[index].quantity = value;
        console.log(list)

        setitems(list);

    };


    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...items];
        list.splice(index, 1);
        setitems(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setitems([...items, { item_number: undefined, item: undefined, quantity: undefined, index: undefined, reason: undefined, item_id: undefined }]);
    };

    const Submit = e => {
        e.preventDefault();
        console.log(validation());
        if (validation())
            alert('Values Missing!')
        else {
            axios.post(API_URL + '/issueitems', {

                items: items,
                department: department,
                date: date,
                request_id: request_id
            }).then(res => {
                if (res.data.code === 200) {
                    window.scrollTo(0, 0);
                    history.push("/storedashboard");
                    setTimeout(() => {
                        window.flash("Item Successfully Issued ");
                    }, 500);
                }

            });

        }
    }


    return (
        <>
            <style type="text/css">{`
                                    .selectitem{
                                        height : inherit !important;
                                        width : 50%;
                                    }
                                    `}
            </style>
            <MainHeader />
            <Container className="Container1 justify-content-center">
                <Form onSubmit={Submit} className="w-100 FormStyle" >
                    <h1 className="Heading">Issue Note</h1>
                    <Form.Group className="FormGroup">
                        <Form.Label className='CenterLabel'>Date</Form.Label>
                        <Form.Control
                            required="true"
                            type="date"
                            value={date}
                            defaultValue={Date.now().toLocaleString()}
                            onChange={(e) => { setdate(e.target.value) }}

                        />
                    </Form.Group>
                    <Form.Group className="FormGroup">
                        <Form.Label className="CenterLabel">Department</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={department}
                            placeholder="Department"
                            onChange={(e) => { setdepartment(e.target.value) }}

                        />
                    </Form.Group>
                    <Form.Group className="FormGroup">
                        <Form.Label className="CenterLabel">Request ID</Form.Label>

                        {/* <Form.Control
                            // required
                            type="text"
                            value={request_id}
                            placeholder="Request ID"
                            onChange={(e) => { setrequestid(e.target.value) }}

                        /> */}
                        <Form.Control as="select" name="request" className="selectitem" onChange={(e) => { console.log(e.target.value); setrequestid(e.target.value); setreqid(requests[requests.map(e => e._id).indexOf(e.target.value)].Order_ID); }} >
                            <option value={null} selected>-</option>
                            {
                                requests.map((request, index) => {
                                    return (
                                        <option value={request._id} className="new-line">{request.Order_ID} - {request.Item}</option>
                                    )
                                })
                            }
                        </Form.Control>
                    </Form.Group>

                    <h4 className="w-100 CenterLabel">Items<Button onClick={handleAddClick} className="float-right btn-success m-2">+</Button></h4>
                    {items.map((x, i) => {
                        return (
                            <Form.Group className="FormGroup w-100">

                                <Form.Control as="select" name="item" className="selectitem" onChange={(e) => { handleInputChange(e, i) }} required>
                                    <option value="" disabled selected>Select Item</option>
                                    {
                                        allitems.map((item, index) => {
                                            return (
                                                <option value={item.Item_ID.Item_Name}>{item.Item_ID.Item_Name}</option>
                                            )
                                        })
                                    }
                                </Form.Control>



                                <Form.Control
                                    required
                                    className="ml-3 mr-3 w-25"
                                    type="Number"
                                    Min="1"
                                    Max={items[i].index !== undefined ? allitems[items[i].index].Quantity : 1}
                                    name="quantity"
                                    placeholder={items[i].index !== undefined ? "Min : 1 - Max : " + allitems[items[i].index].Quantity : "Quantity"}
                                    value={x.quantity}
                                    onChange={e => handleInputChangequantity(e, i)}

                                />


                                <Form.Control

                                    className="ml-3 w-50"
                                    type="text"
                                    name="reason"
                                    placeholder="Reason"
                                    value={x.reason}
                                    onChange={e => handleInputChangereason(e, i)}
                                />


                                {items.length !== 1 && <Button
                                    className="ml-3 btn-danger"
                                    onClick={() => handleRemoveClick(i)}>X</Button>}
                                {/* {items.length - 1 === i && <Button onClick={handleAddClick} className="ml-3 btn-success">+</Button>} */}

                            </Form.Group>

                        )
                    })}


                    <Button className="btn-lg float-right  ml-2 btn-success" onClick={PDF}>Generate Issue Note</Button>

                    <Button className="btn-lg float-right Btn" type="submit" onClick={Submit}>Issue</Button>
                </Form>
            </Container>
        </>
    );

};

export default IssueNote;
