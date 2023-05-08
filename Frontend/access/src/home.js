import axios from "axios"
import { useState } from "react";


export default function HomePage() {
    
    const[currUser, setCurrUser] = useState("guest")
    axios.get("login/").then(res => {
        console.log(res.data)
        setCurrUser(res.data)
    }).catch(error => {
        console.log(error.data)
    });
    
    return (
        <>
        <h1>{currUser}</h1>
        </>
    )
}