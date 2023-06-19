import axios from "axios";
import { useState, useEffect } from "react";
import "./conversation.css"

function Conversation(props) {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [user, setUser] = useState(null);

    useEffect(() => {

        const friendId = props.conversation.members.find(m => m !== props.currentUser._id)

        const getUser = async () => {
            const res = await axios.get("/users?userId=" + friendId);
            setUser(res.data)
        }

        getUser()

    }, [])

    return (
        <>
            {user ? <div className="conversation">
                <img className="conversationImg" src={user.profilePicture == "" ? PF + "noAvatar.png" : PF + user.profilePicture} alt="" />
                <p>{user.username}</p>
            </div> : ""}
        </>

    )
}

export default Conversation