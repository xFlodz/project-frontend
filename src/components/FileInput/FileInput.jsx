import React from "react";
import "./FileInput.css";

const FileInput = ({ id, onChange, buttonText, accept }) => {
  return (
    <div className="file-input-container">
      <label htmlFor={id} className="file-input-button">
        {buttonText}
      </label>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        style={{ display: "none" }} // Скрываем стандартный инпут
      />
    </div>
  );
};

export default FileInput;
