import React from "react";
import "./MessageInput.css";
import { Button } from "../Button/Button";

type TMessageInputProps = {
  onSend: (text: string) => void;
};

export const MessageInput: React.FC<TMessageInputProps> = ({ onSend }) => {
  const [textAreaValue, setTextAreaValue] = React.useState("");

  function handleClick() {
    const trimmed = textAreaValue.trim();
    if (trimmed) {
      onSend(trimmed);
    }
    setTextAreaValue("");
  }

  function onEnter(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      const trimmed = textAreaValue.trim();
      if (trimmed) {
        onSend(trimmed);
      }
      setTextAreaValue("");
      event.preventDefault();
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTextAreaValue(event.target.value);
  }

  return (
    <div className="message-input">
      <textarea
        value={textAreaValue}
        placeholder="напишите сообщение"
        name="message-input"
        className="textarea"
        onChange={handleChange}
        onKeyPress={onEnter}
      ></textarea>
      <Button onClick={handleClick}>отправить</Button>
    </div>
  );
};
