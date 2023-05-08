import axios from "axios";

export default function DeleteSessionCookie() {
    axios.get("/logout/").then(res => {
        console.log(res.data)
    })
}