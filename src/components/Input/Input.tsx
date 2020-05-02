import React from "react";
import "./Input.css";

type TInputProps= {
    onChange? : (event:React.ChangeEvent<HTMLInputElement>) =>void 
    placeholder?: string
}

export const Input:React.FC<TInputProps> = ({onChange,placeholder}) => {
    return(
        <input className="input" onChange={onChange} placeholder={placeholder}></input>
    );
}