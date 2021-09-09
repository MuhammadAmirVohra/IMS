import React, { useEffect, useState } from 'react';
import 'react-bootstrap'
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';

import axios from 'axios';
import Header from '../header/Header'
import { API_URL } from '../../utils/constant';
import { useHistory } from 'react-router';
// import PropTypes from 'prop-types';
import AuthApi from '../Authapi';
// import { css } from "@emotion/react";
// import PuffLoader from "react-spinners/PuffLoader";
// import Cookies from 'js-cookie'
// import {ReactPDF} from '@react-pdf/renderer';
// import PdfGenerator from '../PDF/PdfGenerator'
// import Cookies from 'universal-cookie';
import "../style.css"
const LoginForm = () => {
  // const cookie = new Cookies();

  const Auth = React.useContext(AuthApi);
  const history = useHistory();


  const [Credentials, SetCredentials] = useState({
    username: "",
    password: ""
  });
  const [login, setlogin] = useState(true);
  // Functions

  const onChangeHandle = (e) => {
    const value = e.target.value;
    // console.log(value);
    SetCredentials({
      ...Credentials,
      [e.target.name]: value
    });
  }


  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  function LoadingButton() {
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
      if (isLoading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }




    }, [isLoading]);




    const handleClick = () => {
      setLoading(true);
      onSubmit();
    };

    return (
      <Button className="Btn"

        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}

      >
        {isLoading ? 'Signing in..' : 'Sign In'}
      </Button>
    );
  }



  const onSubmit = () => {

    // event.preventDefault()

    axios({
      method: "POST",
      data: {
        username: Credentials.username,
        password: Credentials.password
      },
      withCredentials: true,
      url: `${API_URL}/login`,
    }).then((res) => {
      console.log(res.data);
      if (res.data) {
        console.log(res.data)
        // settoken(res.data._id)
        if (res.data.code === 404) {
          Auth.settoken(false);
          localStorage.setItem('token', false);
          localStorage.clear();
          // cookie.remove('token');
          // cookie.remove('user');
          setlogin(false)
          window.flash('Login Failed', 'danger');

        }
        else {
          Auth.settoken(true);
          // Cookies.set('user', 'loginTrue')
          // Auth.setRole(res.data.user.Designation);
          localStorage.setItem('token', true);
          localStorage.setItem('user', res.data.user.Designation);
          // cookie.set("token", true, {path: "/"});
          // cookie.set("user", res.data.user.Designation, {path: "/"});

          Auth.setRole(res.data.user.Designation);

          if (res.data.user.Designation === 'Head')
            history.push('/hoddashboard');
          else if (res.data.user.Designation === 'Purchase')
            history.push('/purchase');
          else if (res.data.user.Designation === 'Admin' || res.data.user.Designation === 'Accounts' || res.data.user.Designation === 'Director')
            history.push('/managerdashboard');
          else if (res.data.user.Designation === "Store")
            history.push('/storedashboard')
          else
            history.push('/dashboard');
        }

      }
      else {
        console.log('No user found')
      }
    })
  };

  const onKeyhandle = (e) => {
    if (e.keyCode === 13) {
      console.log("heree")
      onSubmit()
    }
  }
  const [showModal, setShow] = useState(false);


  const ModalContent = () => {
    const [username, setUsername] = useState("");


    const ForgotPasswd = () => {
      setShow(false);
      axios.post(API_URL + '/api/forgotpaswd',
        {
          username: username
        }
      ).then((res) => {
        if (res.data.code === 200) {
          window.flash('Password is sent to ' + res.data.email);
        }
        else if (res.data.code === 201) {
          window.flash('Username Invalid', "danger");
        }
        else if (res.data.code === 400) {
          window.flash(res.data.message, "danger");
        }
      })
    }

    return (
      <Modal show={showModal} onHide={() => { setShow(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>
            Forgot Password
          </Modal.Title>
        </Modal.Header>
        <Form>

          <Modal.Body className="">
            <ul className="list-unstyled">
              <li className="mt-3">
                <Form.Group>
                  <Form.Label>Enter Your Username</Form.Label>
                  <Form.Control value={username} onChange={(event) => { setUsername(event.target.value) }} placeholder="Username" row={6} />
                </Form.Group>

              </li>
            </ul>
          </Modal.Body>


          <Modal.Footer>
            <Button className="btn-danger" onClick={() => { ForgotPasswd() }}>Submit</Button>

          </Modal.Footer>
        </Form>
      </Modal>
    );


  }



  const ForgotPasswd = () => {
    setShow(true);
  }

  return (
    <>
      {showModal ?
        <div>
          <ModalContent />
        </div>
        : null
      }


      <Header />
      <Container className="MainContainer d-flex justify-content-center align-items-center">

        <Row>

          <Col className="text-center">
            <Card className="CardStyle">
              <Form onSubmit={onSubmit} >
                <Card.Header className="text-left" >LOGIN</Card.Header>
                <Card.Body>
                  <Form.Group className="text-left">
                    <Form.Label>Username : </Form.Label>
                    <Form.Control placeholder="Enter Username" onChange={onChangeHandle} type="text" name="username" value={Credentials.username} />

                  </Form.Group>
                  <Form.Group className="text-left">
                    <Form.Label>Password : </Form.Label>
                    <Form.Control onKeyUp={onKeyhandle} placeholder="Enter Password" onChange={onChangeHandle} type="password" name="password" value={Credentials.password} />
                  </Form.Group>

                  {login === false &&

                    <Card.Text className="CardText text-left">*username or password incorrect</Card.Text>

                  }

                  <Form.Group className="text-right">
                    <Button className="mr-2" variant="outline-primary" onClick={ForgotPasswd}> Forgot Password ? </Button>
                    <LoadingButton />

                  </Form.Group>

                  {/* <Button onClick = {() => { ReactPDF.renderToStream(<PdfGenerator/>); }}> PDF </Button> */}


                  {/* <PDF /> */}
                </Card.Body>
              </Form>
            </Card>
          </Col>
        </Row>



      </Container>

    </>
  )

};

export default LoginForm;

// const CardText = styled(Card.Text)`
// color:red;
// margin-top: -13px;
// font-size: 12px;
// `;
// const CardStyle = styled(Card)`
// background: white;
// box-shadow: 6px 5px 5px rgb(0 0 0 );
//     width: 500px;
//     height: 350px;

// `;
// const SigninButton = styled(Button)`
//     background :#EFBB20;
//     border: none;
//     &:hover{
//     background: #0e8ccc;
// }
// `;

// const MainContainer = styled(Container)`
//     width: 100%;
//   height: 100vh;
//   min-height: 100%;
//   min-height: 100vh;
// `;