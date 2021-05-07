import axios from 'axios';
import React from 'react'
import { useHistory } from 'react-router';
// import Auth from '../Authapi'
// import Cookies from 'js-cookie'
import Authapi from '../Authapi'
import { API_URL } from '../../utils/constant';
import Cookie from 'universal-cookie';

function Logout() {
    const cookie = Cookie();
    const history = useHistory()
    const Auth = React.useContext(Authapi)
    axios.get(`${API_URL}/logout`).then((res)=>{

        Auth.settoken(false);
        // settoken(null)
        // Cookies.remove('user');
        // localStorage.clear();
        cookie.remove('user');
        cookie.remove('token');
        history.push('/')

    })

    return (<div></div>);
}

export default Logout

            