import Login from './components/login/Login_Form';
import React, { useState } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import { createGlobalStyle } from "styled-components";
import Dashboard from './components/dashboard/Dashboard';
import LogOut from './components/logout/Logout'
// import SepModal from './components/table/SepModal'
// import Modal from './components/modal/modal'
import AuthApi from './components/Authapi'
// import Cookies from 'js-cookie';
import HODDashboard from './components/hod_dashboard/Hod_dashboard'
// import Request_Form from './components/Request_Form/Request_Form'
import PurchaseDashboard from './components/purchaseDashboard/Purchase_dashboard'
// import axios from 'axios'
import MDashboard from './components/managerDashboard/Manager_dashboard'
import AccountsManagerDetails from './components/RequestDetails/Accounts_manager'
import ManagerAdminDetails from './components/RequestDetails/Manager_admin'
import DirectorDetails from './components/RequestDetails/Director'
import StoreDashboard from './components/StoreDashboard/Store_Dashboard'
import Inventory from './components/inventory/Inventory'
import RecieveItems from './components/recieve_items/Recieve_Items'
import IssueItems from './components/issue/Issue_items'

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
    *{
        font-family: 'Merriweather', sans-serif;
   }
    
`; 
function App() 
{
    const [token , settoken] = useState(false)
    const [UserRole , setRole] = useState(false)

    console.log(token)

    function CheckUser()
    {
        // await  axios({
        //     method: "POST",
        //     withCredentials: true,
        //     url: "http://localhost:5000/loggedin_user",
        //   }).then((res) => {

        //     if(res.data)
        //     {
        //         if(res.data.code === 404)
        //         {
                    // settoken(false);
                    // setRole("");
        //         }
        //         else
        //         {
        //             settoken(true);
        //             setRole(res.data.user.user.Designation);
        //         }
        //     }
            

        // });

            
        let tok = localStorage.getItem('token');
        if (tok) {

            console.log('token found');
            settoken(true); setRole(localStorage.getItem('user'));
        }
        else
        {
            console.log('No token found');
            settoken(false); setRole("");
        }






    }



    React.useEffect(()=> {
        
        CheckUser();

        
        // const user  = Cookies.get('user');
        // if (user) {
        //     settoken(true);
        // }
        // else
        // {
        //     settoken(false);
        // }
    },[])

        return ( 
        <>
        <GlobalStyle/>
            <AuthApi.Provider value = {{token, settoken, UserRole, setRole, CheckUser}}>
            <BrowserRouter>
                <Routes />
            </BrowserRouter>   
            </AuthApi.Provider>    
        </>
    );
}

const Routes = () =>{
    const Auth = React.useContext(AuthApi);
    return(         
           
           <Switch>
                <Route exact path="/" render={() => {
                    let tok = localStorage.getItem('token');
                    if (tok) {
            
                        console.log('token found');
                        Auth.settoken(true); Auth.setRole(localStorage.getItem('user'));
                    }
                    else
                    {
                        console.log('No token found');
                        Auth.settoken(false); Auth.setRole("");
                    }
            
            
                    console.log('Auth Token ', Auth.token);
                    console.log('Auth User Role ', Auth.userRole);

                    // Auth.token === null ? (<Login />) :  <Redirect to="/dashboard"/>
                        

                    if (Auth.token === false)   
                    {
                        console.log("here") ;
                        return <Login /> 
                    }
                    else if(Auth.token !== false && Auth.UserRole === 'General')   
                    {
                        return <Redirect to="/dashboard"/>
                    }
                    else if(Auth.token !== false && Auth.UserRole === 'Purchase')   
                    {
                        return <Redirect to="/purchase"/>
                    }
                    else if(Auth.token !== false && Auth.UserRole === 'Head')   
                    {
                        return <Redirect to="/hoddashboard"/>
                    }
                    else if(Auth.token !== false && (Auth.UserRole === 'Accounts' || Auth.UserRole === "Admin" || Auth.UserRole === "Director") )
                    {
                        return <Redirect to="/managerdashboard"/>
                    }
                    else if(Auth.token !== false && Auth.UserRole === 'Store'  )
                    {
                        return <Redirect to="/storedashboard"/>
                    }
                    
                    
                    
                       
                       
                }}>


                    
                </Route>  
                {/* <ProtectLogin path = '/' exact components = {Login} token = {Auth.token} /> */}

                <Route path ="/inventory"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Store"))
                    { return <Inventory/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}>
                </Route>
                {/* <Route path ="/:itemName/issuerequest"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Store"))
                    { return <IssueItems/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}>
                </Route> */}
                <Route path ="/:id/issuerequest"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Store"))
                    { return <IssueItems/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}>
                </Route>

                <Route path ="/:id/accountsrequest"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Accounts"))
                    { return <AccountsManagerDetails/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}>
                </Route>

                <Route path ="/recieveitems"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Store"))
                    { return <RecieveItems/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}>
                </Route>
                <Route path ="/:id/adminrequest"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Admin"))
                    { return <ManagerAdminDetails/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}> 

                </Route>
                
                <Route path ="/:id/directorrequest"
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === "Director"))
                    { return <DirectorDetails/>}
                    else
                    { return <Redirect exact to="/" ></Redirect>}


                }}> 

                </Route>
                
                <Route  path="/dashboard" 
                render={() => {
                    console.log('Auth Token ', Auth.token);
                    console.log('Auth User Role ', Auth.userRole);
                    if (Auth.token !== false && (Auth.UserRole === 'General' || Auth.UserRole === 'Head'))   
                        { return <Dashboard /> }
                    else    
                    {
                        console.log('here');
                        return <Redirect exact to="/" />
                    }
                       
                       
                }}>
                </Route>
                {/* <ProtectRoute path = '/dashboard' exact comp = {Dashboard} token = {Auth.token} /> */}

                <Route  path="/hoddashboard" 
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === 'Head'))   
                        { return <HODDashboard/> }
                    else    
                    {
                        return <Redirect to="/"/>
                    }
                       
                       
                }}>
                </Route>
                    
                <Route  path="/logout" 
                render={() => {
                    if (Auth.token !== false )   
                        { return <LogOut/> }
                    else    
                    {
                        return <Redirect to="/"/>
                    }
                       
                       
                }}>
                </Route>
                    
                <Route  path="/purchase" 
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === 'Purchase'))   
                        { return <PurchaseDashboard/> }
                    else    
                    {
                        return <Redirect to="/"/>
                    }
                       
                       
                }}>
                </Route>    
                
                <Route  path="/managerdashboard" 
                render={() => {
                    if (Auth.token !== false && (Auth.UserRole === 'Admin' || Auth.UserRole === "Accounts" || Auth.UserRole === "Director"))   
                        { return <MDashboard /> }
                    else    
                    {
                        return <Redirect to="/"/>
                    }
                       
                       
                }}>
                </Route>  

               <Route  path="/storedashboard" 
               render={() => {
                   if (Auth.token !== false && Auth.UserRole === 'Store')   
                       { return <StoreDashboard /> }
                   else    
                   {
                       return <Redirect to="/"/>
                   }
                      
                      
               }}>
               </Route> 
            </Switch>
         
    )
}

// const ProtectRoute = ({token, comp: Component, ...rest})=>{
//     // const Auth = React.useContext(AuthApi);
    
//     return (

//         <Route 
//         {...rest}
//         render={() =>{ 
//          if (token)
//             {
//                 console.log("Token is true")
//                 return <Component />
//             }
        
//         else
//             {
//                 console.log("Token is not true")
//                 return (<Redirect to='/' exact/>)
//             }    
//         }
    
    
//     }
        
//         />
//     )
// }


// const ProtectLogin = ({token, components: Component, ...rest})=>{
//     return (
        
//         <Route 
//         {...rest}
//         render={() => token ? (
//             <Redirect to='/dashboard'/>    
//         ):
//         (
//             <Component />
//         )
    
    
//     }
        
//         />
//     )
// }

export default App;
