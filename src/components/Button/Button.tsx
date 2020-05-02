import React from "react";
import "./Button.css";


type ButtonProps = {
width?:string,
onClick?:()=>void
}

export const Button:React.FC<ButtonProps>= ( {width,onClick,children}  )=> {
    return (
      <button className="button"  onClick = {onClick}>
        {children}
      </button>
    );
  }