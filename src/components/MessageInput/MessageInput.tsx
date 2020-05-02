import React from "react";
import "./MessageInput.css";
import { Button } from "../Button/Button";

type TMessageInputProps = {
  onSend:(text:string)=>void
};

export const MessageInput: React.FC<TMessageInputProps> = ({
onSend
}) => {

  const [textAreaValue,setTextAreaValue]=React.useState("");

  function handleClick() {
    if (textAreaValue){
        onSend(textAreaValue);
    }
    setTextAreaValue("");
  }

 function handleChange(event:React.ChangeEvent<HTMLTextAreaElement>) {
    setTextAreaValue(event.target.value);
  }

  return (
    <div className="message-input">
        <textarea value={textAreaValue} placeholder="напишите сообщение" name="message-input" className= "textarea" onChange={handleChange}></textarea>
        <Button onClick={handleClick}>отправить</Button>
    </div>
    
  );
};