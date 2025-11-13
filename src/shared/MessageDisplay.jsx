import React from "react";
import "./styles/MessageDisplay.css"; // o .module.css si lo usas

export default function MessageDisplay({ message, type = "info" }) {
  return <div className={`msg msg-${type}`}>{message}</div>;
}
