import RequestTable from '../storeTable/Store_Table'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Container, Row } from 'react-bootstrap'
import UserInformation from '../userInformation/User_information.js';
import { useState, useEffect } from 'react';
import HeaderPages from '../header/Header_pages';
import '../style.css'
import { Modal, Form } from 'react-bootstrap';
import { API_URL } from '../../utils/constant';
const StoreDashboard = () => {
    const fetch = () => {
        axios.get(API_URL + '/iteminfo').then(res => {
            console.log("data", res.data);
            setallitems(res.data);
        });

    }
    const [allitems, setallitems] = useState([]);
    useEffect(() => {

        fetch();

    }, []);

    const [showModal, setShow] = useState(false)
    const [showOperationModal, setoperation] = useState(false);
    const ModalContent = () => {

        const [additem, setadditem] = useState();
        const [additemtype, setadditemtype] = useState();
        const [additemdescription, setadditemdescription] = useState();
        const [deleteitem, setdeleteitem] = useState();
        const [error, seterror] = useState(false);

        const changeitemname = (name) => {
            seterror(false);
            setadditem(name);

            for (let i = 0; i < allitems.length; i++) {
                if (name === allitems[i].Item_ID.Item_Name) {
                    console.log('Same Name : ', name);
                    seterror(true);
                    break;
                }
            }
            if (!error) {
                console.log(name);
            }
        }

        const AddItem = () => {
            axios.post(API_URL + "/additemname", {
                item_name: additem,
                item_type: additemtype,
                item_description: additemdescription
            }).then((res) => {
                setShow(false);
                if (res.data.code === 200) {
                    window.flash('Item Added Successfully');
                    fetch();
                }
                else
                    window.flash('Item Failed to Delete', 'danger');
            })

        }
        const DeleteItem = () => {
            axios.post(API_URL + "/deleteitemrecord", {
                item_id: deleteitem
            }).then((res) => {
                setShow(false);
                if (res.data.code === 200) {
                    window.flash('Item Added Successfully');
                    fetch();
                }
                else
                    window.flash('Item Failed to Add', 'danger');
            })
        }

        return (
            <Modal show={showModal} onHide={() => { setShow(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Product Addition & Deletion
                    </Modal.Title>
                </Modal.Header>
                <Form className="FormStyle">

                    <Modal.Body className="w-100 ModalBody">
                        <Form.Group className="FormGroup">
                            <Form.Label className="CenterLabel">Delete Item</Form.Label>

                            <Form.Control as="select" name="item" className="selectitem" onChange={(e) => { console.log(e.target.value); setdeleteitem(e.target.value) }} required>
                                <option value="" selected>Select Item To Delete</option>
                                {
                                    allitems.map((item, index) => {
                                        return (
                                            <option value={item.Item_ID._id}>{item.Item_ID.Item_Name}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                            <Button className="btn btn-danger ml-2 h-25" onClick={DeleteItem}>Delete</Button>
                        </Form.Group>
                        <Form.Group className=" w-100 h-50">
                            <Form.Label className="CenterLabel">Add Item</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={additem}
                                placeholder="Item Name"
                                onChange={(e) => { changeitemname(e.target.value) }}

                            />
                            <Form.Control
                                // required
                                type="text"
                                value={additemtype}
                                placeholder="Item Type"
                                onChange={(e) => { setadditemtype(e.target.value) }}

                            />
                            <Form.Control
                                // required
                                type="text"
                                value={additemdescription}
                                placeholder="Item Description"
                                onChange={(e) => { setadditemdescription(e.target.value) }}

                            />
                            {error ?
                                <Button className="btn btn-md float-right btn-danger m-2" disabled>Item Name Already Exist</Button>

                                :
                                <Button className="btn btn-md float-right btn-success m-2" onClick={AddItem}>Add Item</Button>
                            }
                        </Form.Group>
                    </Modal.Body>



                </Form>
            </Modal>
        );


    }



    const OperationModal = () => {

        return (
            <Modal show={showOperationModal} onHide={() => { setoperation(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Store Operations
                    </Modal.Title>
                </Modal.Header>
                {/* <Form className="FormStyle"> */}

                <Modal.Body className="ModalStyle">
                    <Container fluid>
                        <Row>
                            <Link to="/issuenote"> <Button className="btn Btn m-3 btn-lg button-lg-width"> Issue Item </Button> </Link>
                        </Row>
                        <Row>
                            <Link to="/receivenote"> <Button className="btn Btn btn-lg m-3 button-lg-width"> Recieve Item </Button> </Link>
                        </Row>
                        <Row>
                            <Link to="/returnnote"> <Button className="btn Btn btn-lg m-3 button-lg-width"> Return Item </Button> </Link>
                        </Row>
                    </Container>
                </Modal.Body>



            </Modal>
        );


    }













    return (
        <>
            {showModal ?
                <div>
                    <ModalContent />
                </div>
                :
                showOperationModal ?
                    <div>
                        <OperationModal />
                    </div>
                    : null
            }
            <HeaderPages />
            <Container className="MainContainer">

                <UserInformation />


                <Link to="/inventory"> <Button className="btn Btn btn-md mt-4 mb-4 float-right"> Inventory </Button> </Link>
                <Button className="btn btn-success btn-md mt-4 mb-4 mr-2 float-right" onClick={() => { setShow(true); }}> Product Addition & Deletion </Button>
                {/* <Link to="/issuenote"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Issue Item </Button> </Link>
                <Link to="/receivenote"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Recieve Item </Button> </Link>
                <Link to="/returnnote"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Return Item </Button> </Link> */}
                <Button className="btn btn-success btn-md mt-4 mb-4 mr-2 float-right" onClick={() => { setoperation(true); }}> Store Operations </Button>
                <Link to="/productledger"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Product Ledger </Button> </Link>
                <Link to="/stockreport"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Stock Report </Button> </Link>
                <Link to="/previousrequests"> <Button className="btn Btn btn-md mt-4 mb-4 mr-2 float-right"> Previous Requests </Button> </Link>


                <RequestTable />
            </Container>
        </>
    )


}

export default StoreDashboard;

// const Btn = styled(Button)`
//     background :#EFBB20;
//     border: none;
//     &:hover{
//     background: #0e8ccc;
// }
// `;
// const MainContainer = styled(Container)`
//     width: 100%;
//     height: auto;
//     min-height: 100%;
//     min-height: 100vh;
//     margin-top:100px;
// `;