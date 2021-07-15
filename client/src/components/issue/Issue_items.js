import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Row,
  Table,
  Button,
  Container,
  Modal,
  Form,
  Card,
} from "react-bootstrap";
// import styled from 'styled-components';
import MainHeader from "../header/Header_pages";
import { useParams, useHistory } from "react-router";
import { API_URL } from "../../utils/constant";
import "../style.css";
// import { func } from 'prop-types';

const IssueItems = () => {
  const history = useHistory();
  const arr = ["Name", "Type", "Description", "Quantity"];
  // const [items, setitems] = useState([])

  const { id } = useParams();

  const [requested, setRequested] = useState({});
  const [iName, setItemName] = useState("");
  const [inventory, setInventory] = useState([]);
  const [department, setDepartment] = useState([]);

  async function fetch() {
    await axios
      .get(`${API_URL}/` + id + "/issuerequest", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("IN ISSUE_ITEMS.JS", res.data);
        if (res.data.code === 404) {
          history.push("/storedashboard");
        } else if (res.data.code === 200) {
          console.log(res.data);
          setRequested(res.data.requested_item);
          setInventory(res.data.inventory_items);
          // setItemName(res.data.requested_item.Item);
          setDepartment(res.data.department);

        }

      });
  }

  const onPurchase = () => {
    axios
      .post(`${API_URL}/request_forward_purchase`, { id: id })
      .then((res) => {
        if (res.data) {
          setShow(false);
          console.log("Request Forwarded to Purchase Department");
          window.flash("Request Forwarded to Purchase Department");
          history.push("/storedashboard");
        }
      });
  };

  const onCancel = (_id, email, name, item) => {
    axios
      .post(`${API_URL}/request_cancel`, {
        id: _id,
        email: email,
        name: name,
        item: item,
      })
      .then((res) => {
        if (res.data) {
          window.flash("Request Cancelled");
          fetch();
          history.push("/storedashboard");
        }
      });
  };

  useEffect(() => {
    fetch();
    // axios
    //   .get(`${API_URL}/` + id + "/issuerequest", {
    //     withCredentials: true,
    //   })
    //   .then((res) => {
    //     console.log("IN ISSUE_ITEMS.JS", res.data);
    //     if (res.data.code === 404) {
    //       history.push("/storedashboard");
    //     } else if (res.data.code === 200) {
    //       console.log(res.data);
    //       setRequested(res.data.requested_item);
    //       setInventory(res.data.inventory_items);
    //       setItemName(res.data.requested_item.Item);
    //     }

    //   });
  }, []);
  // /////////////////////////////////////////////////
  const [showModal, setShow] = useState(false);
  const [ModalInfo, SetInfo] = useState({});
  const [item_id, set_item_id] = useState("");
  const ModalContent = () => {
    // const [name, setname] = useState(ModalInfo.Item_Name);
    // const [quantity, setquantity] = useState(ModalInfo.Item_Quantity);
    // const [description, setdescription] = useState(ModalInfo.Item_Description);
    // const [type, settype] = useState(ModalInfo.Item_Type);
    const [Quantity, setQuantity] = useState();
    const [Duration, setDuration] = useState();
    const [Department, setDepartment] = useState();
    const UpdateRecord = (event, q) => {

      console.log("Quantity : ", ModalInfo.Item_Quantity - Quantity);
      axios
        .post(`${API_URL}/issued_item`, {
          quantity: Quantity,
          duration : Duration,
          department : Department,
          request_id: requested._id,
          item_id: item_id,
          id : requested._id
        })
        .then((res) => {
          setShow(false);
          console.log(res);
          if (res.data.code === 404) {
            window.scrollTo(0, 0);
            window.flash("Item Quantity Invalid", "danger");
          } else if (res.data.code === 200) {
            window.scrollTo(0, 0);
            history.push("/storedashboard");
            setTimeout(()=>{
            window.flash("Item Successfully Issued ");
            }, 1000) 
            // fetch();
          }
          //  setRequested(res.data);
        });
    };



    return (
      <Modal
        show={showModal}
        onHide={() => {
          setShow(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="ModalBody">
          <h5>
            <strong>Requested Item Information</strong>
          </h5>
          <p>Item Name: {requested.Item}</p>
          <p>Quantity Requested: {requested.Quantity}</p>
          <p>Duration of Request: {requested.Duration}</p>
          <p>Request from Department: {department}</p>

          <h5>
            <strong>Inventory Information</strong>
          </h5>
          <p>Item Name: {ModalInfo.Item_ID.Item_Name}</p>
          <p>Quantity Available: {ModalInfo.Quantity}</p>
{/*
          <p>
            <strong>Set Issue Quantity</strong>
          </p> */}

          <Form>
          <Form.Control
              type="text"
              value={Department}
              placeholder = "Department"
              onChange={(event) => {
                setDepartment(event.target.value);
              }}
            />
          <Form.Control
              type="text"
              value={Duration}
              placeholder = "Duration"
              onChange={(event) => {
                setDuration(event.target.value);
              }}
            />

          <Form.Control
              type="number"
              value={Quantity}
              placeholder = "Quantity"
              onChange={(event) => {
                setQuantity(event.target.value);
              }}
            required
            />

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => UpdateRecord(ModalInfo.Item_Quantity - Quantity)}
            type="submit"
            className="Btn btn-success"
          >
            Issue
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      {showModal ? (
        <div>
          <ModalContent />
        </div>
      ) : null}

      <MainHeader />

      <Container className="MainContainer">
        <Row className="Row1">
          <h1>Store Inventory</h1>
        </Row>
        <Row className="Row1">
          <Card>
            <Card.Header>Requested Item Information</Card.Header>
            <Card.Body>
              <Card.Title>Item Name: {requested.Item}</Card.Title>
              <Card.Title>Quantity Requested: {requested.Quantity}</Card.Title>
              <Card.Title>Duration of Request: {requested.Duration}</Card.Title>
              <Card.Title>Request from Department: {department}</Card.Title>

            </Card.Body>
            {/* <Btn onClick = {() => {SetInfo(request); setShow(true);} } className = "mr-1"> Details </Btn> */}
            {/* <Btn onClick={()=>onIssue(request._id)} className = "btn-success mr-1">Issue</Btn> */}
            <Card.Footer>
              <Button
                className="Btn btn-success mr-4"
                onClick={() => {
                  onPurchase();
                }}
              >
                Send To Purchase Department
              </Button>
              <Button
                className=" btn-danger"
                onClick={() =>
                  onCancel(
                    requested._id,
                    requested.R_Emp_Email,
                    requested.R_Emp_Name,
                    requested.Item
                  )
                }
              >
                Cancel
              </Button>
            </Card.Footer>
          </Card>
        </Row>
        <Row className="Row1 float-right">
          <Form>
            <Form.Group className="FormGroup">
              <Form.Label className="mt-auto mr-2">Search: </Form.Label>
              <Form.Control
                type="text"
                placeholder="Search"
                name="searchbar"
                value={iName}
                onChange={(event) => {
                  setItemName(event.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Row>

        {inventory.length > 0 && (
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
              {inventory.map((item, index) => {
                if (
                  item.Item_ID.Item_Name.toLowerCase().includes(iName.toLowerCase()) ||
                  item.Item_ID.Item_Description.toLowerCase().includes(
                    iName.toLowerCase()
                  )
                )
                  return (
                    <>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          {item.Item_ID.Item_Name}
                          <br />
                        </td>
                        <td>{item.Item_ID.Item_Type}</td>
                        <td>{item.Item_ID.Item_Description}</td>
                        <td>{item.Quantity}</td>
                        <td>
                          <Button
                            className="Btn"
                            onClick={() => {
                              SetInfo(item);
                              set_item_id(item.Item_ID._id);
                              setShow(true);
                            }}
                          >
                            Confirm Issue
                          </Button>
                        </td>
                      </tr>
                    </>
                  );
                // else return(<tr></tr>)
              })}
            </tbody>
          </Table>
        )}

        {inventory.length === 0 && <h2 className="mt-2">No Items.</h2>}
      </Container>
    </>
  );
};

export default IssueItems;

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
//     padding:10px;
// }

// `;

// const FormGroup = styled(Form.Group)`
// display : flex

// `;

// const FormLabel = styled(Form.Label)`
// font-size : 25px

// `;
