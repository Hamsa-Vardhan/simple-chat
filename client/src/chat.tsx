import React, { FC, useRef, useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useHistory, useParams } from "react-router-dom"
import MessageFile from './messages/file'
import MessageText from './messages/text'
import io from 'socket.io-client'


interface StoreInterface {
    file: boolean;
    position: string;
    data: string;
    name?: string;
    fileName?: string;
    fileType?: string;
}

interface fileInfo {
    name: string;
    file: string;
    type: string;
    senderName: string;
}

const Chat: FC = () => {

    const history = useHistory()
    const params: { room: string } = useParams()
    const { current: uName } = useRef<string>(localStorage.getItem("name"))
    const [messages, setMessages] = useState<StoreInterface[]>([{ data: "Welcome to the room", position: "center", file: false }])
    const [socket, setSocket] = useState<SocketIOClient.Socket>();
    const scrollDown = useRef<HTMLDivElement>(null)

    const socketListen = (socket: SocketIOClient.Socket) => {
        socket.on("noob", (msg: string) => {
            setMessages((initial) => [...initial, { data: msg, position: "center", file: false }])
        })
        socket.on("msg", (val: any) => {
            setMessages(initial => [...initial, {
                data: val["msg"],
                position: "left",
                name: val["id"],
                file: false
            }])
        })
        socket.on("file", ({ name, file, type, senderName }: fileInfo) => {
            setMessages(initial => [...initial, {
                data: file,
                file: true,
                fileName: name,
                fileType: type,
                position: "left",
                name: senderName
            }])
        })
        socket.on("error", (error: any) => console.log(error))
    }

    useEffect(() => {
        if (!uName) history.push("/")
        if (scrollDown.current) {
            scrollDown.current.scrollTop = scrollDown.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        const socket = io.connect("https://hava-simple-chat.herokuapp.com/", { reconnectionDelayMax: 10000 })
        socketListen(socket);
        setSocket(socket);
        socket.emit("joined", { name: uName, room: params.room })
        return () => {
            console.log("executed")
            socket.removeAllListeners()
            socket.disconnect();
        }
    }, [])



    const sendFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files.length) {
            const file = e.currentTarget.files[0];
            if (file.size > 10 && file.size < 5 * 10 ** 6) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        const type = file.type.slice(0, file.type.search("/"))
                        setMessages(initial => [...initial, { position: "right", data: (reader.result as string), file: true, fileType: type, fileName: file.name }])
                        socket?.emit("file", { file: reader.result, name: file.name, type })
                    }
                }
                reader.readAsDataURL(file)
            }
            else alert("file size must be less than 5Mb")
        }
    }


    const sendMessage = (e: FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const form: HTMLFormElement = (e.currentTarget as HTMLFormElement)
        const inputMessage = (form.elements[0] as HTMLInputElement).value
        if (!socket || !inputMessage) {
            form.reset()
            return
        }
        socket.emit("msg", inputMessage)
        setMessages(initial => [...initial, { data: inputMessage, position: "right", file: false }])
        form.reset()
    }


    return (
        <div className="container" >
            <button className="back" onClick={() => history.replace("/")} > &larr; </button>
            <div className="messages" ref={scrollDown} >
                {messages.map((message: StoreInterface, index: number) => message.file ?
                    <MessageFile key={index} position={message.position} data={message.data} name={(message.fileName as string)} senderName={message.name} type={(message.fileType as string)} />
                    : <MessageText key={index} text={message.data} position={message.position} name={message.name} />
                )}
            </div>
            <form className="input" onSubmit={sendMessage}>
                <input type="text" name="message" id="message" autoFocus />
                <label htmlFor="file">
                    <p> file </p>
                    <input type="file" accept="image/*, audio/*, video/*" name="file" id="file" hidden onChange={sendFile} />
                </label>
                <button type="submit" > <span> &rarr; </span> </button>
            </form>
        </div>
    )
}




export default Chat;