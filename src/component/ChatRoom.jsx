import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import Moment from "react-moment"
import { io } from "socket.io-client";

const ChatRoom = () => {
    const location = useLocation()
    const msgBoxRef = useRef()

    const [data, setData] = useState({})
    const [mssg, setMssg] = useState("")
    const [socket, setSocket] = useState()
    const [allMssgs, setMssgs] = useState([])


    useEffect(() => {
        const socket = io("http://localhost:8000/");
        setSocket(socket)
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
            socket.emit("joinRoom", location.state.room)
        })

}, [])


    useEffect(() => {
        setData(location.state)
        console.log(data)
    }, [location])


    useEffect(() => {
        if(socket){
            socket.on("getLatestMessage", new_message => {
                setMssgs([...allMssgs, new_message])
                msgBoxRef.current.scrollIntoView({behavior: "smooth"})
                setMssg("")
            })
        }
    }, [socket, allMssgs])



    function handleChange(e){
        const new_mssg = e.target.value
        setMssg(new_mssg)
    }

    function onSubmit(){
        if(mssg){
            const new_message = {time: new Date(), mssg, name: data.name}
            socket.emit("new_message", {new_message, room: data.room})   
        }
        
        //setMssgs([...allMssgs, new_message])
    }

    function handleEnter(e){
        return e.keyCode===13 ? onSubmit() : ""
    }

    return(
        <div className="py-4 m-5 w-50 shadow bg-white text-dark border rounded container">
            <div className="text-center px-3 mb-4 text-capitalize">
                <h1 className="text-warning mb-4">{data?.room} Chat Room</h1>
            </div>
            <div className="bg-light border rounded p-3 mb-4" style={{heig
            : "450px", overflow: "scroll"}}>
            {allMssgs.map(message => {
                return data.name === message.name
                ?
                    <div className="row justify-content-end p1-5">
                    <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded w-auto">
                        <div>
                            <strong className="m-1">{message.name}</strong>
                            <small className="text-muted"><Moment fromNow>{message.time}</Moment></small>
                        </div>
                        <h4 className="m-1">{message.mssg}</h4>
                    </div>
                </div> 
                :
                    <div className="row justify-content-start">
                    <div className="d-flex flex-column m-2 shadow p-2 bg-white border rounded w-auto">
                        <div>
                            <strong className="m-1">{message.name}</strong>
                            <small className="text-muted m-1"><Moment fromNow>{message.time}</Moment></small>
                        </div>
                        <h4 className="m-1">{message.mssg}</h4>
                    </div>
                </div>
                
            })}

             <div ref={msgBoxRef}></div>   
                       
            </div>
            <div className="form-group d-flex">
                <input onKeyDown={handleEnter} value={mssg} type="text" onChange={handleChange} className="form-control bg-light" name="message" placeholder="Type your message"></input>
                <button onClick={onSubmit} type="button" className="btn btn-warning mx-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ChatRoom