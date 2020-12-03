import React, { FC, FormEvent, InputHTMLAttributes } from "react"
import { useHistory } from 'react-router-dom'


type CustomInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
    labelText: string;
    id: string;
}


export const CustomInput: FC<CustomInputProps> = ({ id, labelText, ...inputProps }) => <div className="custom-input" >
    <label htmlFor={id}>
        {labelText}
    </label>
    <input id={id} {...inputProps} />
</div>



const Home: FC = () => {


    const history = useHistory();

    const enterRoom = (e: FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const form: HTMLFormElement = e.currentTarget as HTMLFormElement;
        const nameInput: HTMLInputElement = form.elements[0] as HTMLInputElement;
        const roomInput: HTMLInputElement = form.elements[1] as HTMLInputElement;
        if (roomInput.value && nameInput.value) {
            localStorage.setItem("name", nameInput.value);
            history.push(`/${roomInput.value}`)
        }
        form.reset()
    }


    return (

        <>
            <div className="home" >
                <form action="" onSubmit={enterRoom}>
                    <CustomInput autoFocus required defaultValue={localStorage.getItem("name") || ""} labelText="name" type="text" name="name" id="name" placeholder="Enter your name" />
                    <CustomInput labelText="room" required type="text" name="room" id="room" placeholder="Enter room" />
                    <div>
                        <button> enter </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Home