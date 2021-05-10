import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {Card} from 'react-bootstrap';
// import Authapi from '../Authapi'
import { useHistory } from 'react-router';
// import Cookies from 'js-cookie'
// import styled from 'styled-components';
import {Button, Collapse, Form} from 'react-bootstrap';
import {API_URL} from '../../utils/constant'
import '../style.css';

const UserInformation = () => {
   
    const [Credentials, SetCredentials] = useState({
        name : "",
        username : "",
        password : ""
    });

    const [Profile, setProfile] = useState({
        emp_Name: "",
        designation: "",
        department: ""
    })
    const [open, setOpen] = useState(false)
    const [id, Setid] = useState({})
    const history = useHistory();

    useEffect(() =>{
     

        axios.get(`${API_URL}/dashboard1`, {
            withCredentials: true
        }).then((res)=>{
            if(res.data)
            { 
                console.log(res.data)
                const user = res.data;
                Setid(res.data.user._id);
                SetCredentials({
                    name : res.data.user.Emp_Name,
                    username : res.data.user.Username,
                    password : res.data.user.Password
                })
                console.log(res.data.user);
                setProfile({
                    emp_Name: user.user.Emp_Name,
                    designation: user.user.Designation,
                    department: user.department.Dept_Name
                })
            }
            else
            { 
                history.push('/logout')
            }
            
        })

    },[history])
    const onChangeHandle = (e) => {
        const value = e.target.value;
        console.log(value);
        SetCredentials({
            ...Credentials,
            [e.target.name] : value
       });
       
    }
    const onSubmit = (event) => {   
        
        event.preventDefault()
        axios({
            method: "POST",
            data: {
                id : id,
                name: Credentials.name,
                username: Credentials.username,
                password: Credentials.password
            },
            withCredentials: true,
            url: `${API_URL}/update_profile`,
          }).then((res)=>{
            setProfile({
                ...Profile,
                emp_Name: Credentials.name,
            })
            setOpen(false)
        })
        };
    

    return(  
    <>
    


    <Card className="Card1">
        <Card.Header>User Information</Card.Header>
            <Card.Body>

                { Profile &&
                <>
                    <Card.Title><strong>User:  </strong>{Profile.emp_Name}</Card.Title>
                    <Card.Title><strong>Designation:</strong> {Profile.designation}</Card.Title>  
                    <Card.Title><strong>Department:</strong> {Profile.department}</Card.Title>  
                    <Button
                        className="Btn mb-4"
                        onClick={() => setOpen(!open)}
                        aria-controls="collapse_menu"
                        aria-expanded={open}
                    >
                        Edit Profile
                    </Button>

                    <Collapse in={open}>
                        
                    
                        <div id="collapse_menu">
                        <Form onSubmit={onSubmit}>
                        <Form.Group>
                             <Form.Label>Name :</Form.Label>
                             <Form.Control name = "name" onChange={onChangeHandle} value={Credentials.name}/>
                         </Form.Group>
                        
                        <Form.Group>
                             <Form.Label>Username :</Form.Label>
                             <Form.Control name = "username" onChange={onChangeHandle} value={Credentials.username} />
                         </Form.Group>
                        <Form.Group>
                            <Form.Label>Password :</Form.Label>
                            <Form.Control name = "password" onChange={onChangeHandle} value={Credentials.password} />
                        </Form.Group>
                        <Button className="Btn" type = "submit">Update</Button> 
                        </Form>
                        </div>
                    </Collapse>
    
                </>
                }
                
            </Card.Body>
    </Card>
             
           

</>        
)
    

};

export default UserInformation;
