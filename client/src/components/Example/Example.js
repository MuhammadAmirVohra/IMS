import React from 'react';
import {Container} from 'react-bootstrap';

const Example = (props) => {
    return(  
        <Container>
            {props.name}
        </Container>
    )
};

export default Example;
