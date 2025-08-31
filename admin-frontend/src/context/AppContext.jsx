import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    // const [userData, setUserData] = useState(false)

    // const loadUserProfileData = async () => {
    //     try {
    //         const { data } = await axios.get(backendUrl + '/api/user/getProfile', {
    //             headers: { token }
    //         })

    //         console.log("user profile data ", data);
    //         if (data.success) {
    //             console.log(data.userData);
    //             setUserData(data.userData)
    //         } else {
    //             toast.error(data.message)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         toast.error('Something went wrong in loadUserProfileData: ' + error.message)
    //     }
    // }

    // useEffect(()=>{
    //     if(token) {
    //         console.log("you should get the data now ");
    //         loadUserProfileData()
    //     }
    //     else {
    //         setUserData(false)
    //     }
    // },[token])

    const value = {
        backendUrl, token, setToken
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;