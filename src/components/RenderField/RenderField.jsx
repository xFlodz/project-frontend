import React from "react";
import InputMask from "react-input-mask";

const RenderField = ({ 
  label, 
  name, 
  type = "text", 
  required = false, 
  isOwner, 
  isAdmin, 
  editableData, 
  userData, 
  handleChange 
}) => {
    
  if ((name === "phone") && (isOwner || isAdmin)) {
    return (
      <>
        <label>{label}:</label>
        <InputMask
          mask="+7 (999) 999-99-99"
          value={editableData?.[name] || ""}
          onChange={handleChange}
          required={required}
        >
          {(inputProps) => <input type="tel" name={name} {...inputProps} />}
        </InputMask>
      </>
    );
  }

  if ((name === "telegram_id") && (isOwner || isAdmin)) {
    return (
      <>
        <label>{label}:</label>
        <input
          type="text"
          name={name}
          value={editableData?.[name] || ""}
          onChange={(e) => {
            let value = e.target.value;
            if (!value.startsWith("@")) {
              value = "@" + value.replace(/^@*/, "");
            }
            handleChange({ target: { name, value } });
          }}
          required={required}
        />
      </>
    );
  }

  if (isOwner || isAdmin) {
    return (
      <>
        <label>{label}:</label>
        <input
          key={name}
          type={type}
          name={name}
          value={editableData?.[name] || ""}
          onChange={handleChange}
          required={required}
        />
      </>
    );
  } else {
    if (["role", "name", "surname", "thirdname", "phone", "telegram_id"].includes(name)) {
      return (
        <>
          <label>{label}:</label>
          <p>{userData[name] || "-"}</p>
        </>
      );
    }
    return null;
  }
};

export default RenderField;
