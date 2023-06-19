
import React, { useRef, useState, useContext, useEffect } from 'react'
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import "./messenger.css"
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import {io} from "socket.io-client"

function Messenger() {

    const [conversations, setConversations] = useState(null);

    const [currentChat, setCurrentChat] = useState(null);

    const [messages, setMessages] = useState(null);

    const [newMessage, setNewMessage] = useState("");

    const socket = useRef()

    const scrollRef = useRef();

    const {user} = useContext(AuthContext);

    const [arrivalMessage, setArrivalMessage] = useState("")

    const [onlineUsers, setOnlineUsers] = useState(null)

    const handleChangeCurrentChat = (conversation) => {
        setCurrentChat(conversation)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id
        };

        const receiverId = await currentChat.members.find(member => member !== user._id)

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage
        })

        const res = await axios.post("/messages/", message);
        setMessages([...messages, res.data]);
        setNewMessage("")
    }

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
        socket.current.on("getUsers", users => {
            setOnlineUsers(users)
        })
        socket.current.emit("addUser", user._id);
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
        setMessages(prev => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        const getConversations = async () => {
            const res = await axios.get("/conversations/" + user._id);
            
            setConversations(res.data)
        }

        getConversations()
    }, [user._id])

    useEffect(() => {
        const getMessages = async () => {
            const res = await axios.get("/messages/" + currentChat?._id)
            setMessages(res.data)
            // console.log(res.data)
        }

        getMessages();
    }, [currentChat])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages])

    return (
        <> 
            <Topbar />
            <div className='messenger'>
                <div className='chatMenu'>
                    <div className='chatMenuWrapper'>
                        <input placeholder='Search for Friends' className='chatMenuInput'/>
                        {conversations != null ? conversations.map((conversation) => {
                            return (
                                <div onClick={() => handleChangeCurrentChat(conversation)}>
                                    <Conversation conversation={conversation} currentUser={user} />
                                </div>
                            )
                        }) : ""}
                    </div>
                </div>

                <div className='chatBox'>
                    <div className='chatBoxWrapper'>
                        {currentChat ? <>
                        <div className='chatBoxTop'>
                            {messages ? 
                                messages.map(message => {
                                    return (
                                        <div ref={scrollRef}>
                                            <Message message={message} own={message.sender == user._id} />
                                        </div>
                                    )
                                })
                            : "You haven't spoken in this chat yet"}
                        </div>
                        <div className='chatBoxBottom'>
                            <textarea onChange={(e) => {setNewMessage(e.target.value)}} value={newMessage} className='chatMessageInput' placeholder='send a message'></textarea>
                            <button onClick={handleSubmit} className='chatSubmitButton'>Send</button>
                        </div> </>: <span className='noConversationText'>Open a conversation to chat</span>}
                    </div> 
                </div>

                <div className='chatOnline'>
                    <div className='chatOnlineWrapper'>
                        <ChatOnline onlineUsers={onlineUsers} currentId={user._id} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger;