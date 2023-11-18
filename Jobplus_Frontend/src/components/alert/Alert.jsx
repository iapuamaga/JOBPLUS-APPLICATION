import React from "react";
import "./Alert.scss";

export default function Alert({
  data: { message, details = [], type = "error" },
}) {
  if (!message) return null;

  return (
    <div>
      <div className={`alert alert--${type}`}>
        <p className="alert__message">{message}</p>
        <ul className="alert__details">
          {details.map((detail) => (
            <li className="alert__detail">{detail.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
