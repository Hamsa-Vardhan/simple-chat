import React, { FC } from "react";

interface MessageTextProps {
    text: string;
    position: string;
    name?: string;
}

const MessageText: FC<MessageTextProps> = ({ name, text, position }) => (
    <div className={position} >
        { name ? <p> {name} </p> : ""}
        <h6>
            {text}
        </h6>
    </div>
)

export default MessageText