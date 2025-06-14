/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom'

export default function AuthProtector({children}) {

    if (localStorage.getItem('userToken') === null) 
    {    
        return children
    }
    else 
    {
        return <Navigate to={'/'}/>
    }
}
