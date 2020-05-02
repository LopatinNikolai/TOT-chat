import React from "react";
import "./Message.css";


export enum Positions {
    RIGHT ="right",
    LEFT ="left"
}
type TMessageProps = {
  messageLocation: Positions;
  name: string;
  surname: string;
};

export const Message: React.FC<TMessageProps> = ({
  messageLocation,
  name,
  surname,
  children,
}) => {
  return (
    <div className={messageLocation}>
      <div className="contaner-message">
        <p className="user">
          {name} {surname}
        </p>
        <p className="message">{children}</p>
      </div>
    </div>
  );
};
