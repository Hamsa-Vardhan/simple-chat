import React, { FC, useState, useRef } from "react"
import Tippy from '@tippyjs/react';



interface MessageFileProps {
    data: string;
    position: string;
    senderName?: string;
    name: string;
    type: string;
}

const MessageFile: FC<MessageFileProps> = ({ data, position, senderName, name, type }) => {

    const [mute, setMute] = useState<boolean>(true)
    const audioRef = useRef<HTMLAudioElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    const togglePlay = (media: string) => {
        let tag: HTMLAudioElement | HTMLVideoElement | null;
        if (media === "audio") tag = audioRef.current
        else if (media === "video") tag = videoRef.current
        else tag = null;
        if (tag) {
            tag.load()
            tag.onloadedmetadata = () => {
                if (tag) {
                    tag.pause()
                    tag.currentTime = 0
                    tag.play()
                }
            }
        }
    }
    const toggleMute = () => {
        setMute(p => !p)
    }

    const getFile = (): JSX.Element => {
        switch (type) {
            case "image": return <img src={data} />
            case "audio": return <Tippy content={'click to toggle mute, double click to start again'} >
                <h6 className="audio" onClick={toggleMute} onDoubleClick={() => togglePlay("audio")} > {name} <audio ref={audioRef} src={data} muted={mute} hidden autoPlay /></h6>
            </Tippy>
            case "video": return <Tippy content="click to toggle mute, double click to start again" >
                <video ref={videoRef} src={data} muted={mute} autoPlay onDoubleClick={() => togglePlay("video")} onClick={toggleMute} /></Tippy>
            default: return <h5 style={{ color: "red" }} >  Error Occured </h5>
        }
    }



    const getClassName = () => {

        const classes: string[] = []
        classes.push(position)
        if (type !== "audio") classes.push("file")
        return classes.join(" ")

    }

    return <div className={getClassName()}>
        {name ? <p> {senderName} </p> : ""}
        {type === "audio" ? getFile() : <div>
            {getFile()}
        </div>}
    </div>
}


export default MessageFile