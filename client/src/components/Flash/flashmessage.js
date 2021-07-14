import React, { useEffect, useState } from 'react';
import Bus from '../Bus';
import {Alert} from 'react-bootstrap';
// import styled from 'styled-components'


const Flash = () => {
  
    let [visibility, setVisibility] = useState(false);
    let [message, setMessage] = useState('');
    let [type, setType] = useState('');


    useEffect(() => {
        Bus.addListener('flash', ({message, type}) => {
            console.log('flash')
            setVisibility(true);
            setMessage(message);
            setType(type);
            setTimeout(() => {
                setVisibility(false);
            }, 2000);
        });
                

    }, []);

    useEffect(() => {
        if(document.querySelector('.close') !== null) {
            document.querySelector('.close').addEventListener('click', () => setVisibility(false));
        }
    })

    return (
        visibility &&   <Alert className = "AlertMessage"  variant={type}>
                <p className="m-0 text-center">{message}</p>
            </Alert>
    )
}

export default Flash;

