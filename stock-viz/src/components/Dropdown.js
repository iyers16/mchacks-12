import React from "react";

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <label style={{ marginRight: "10px" }}>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="" disabled>
          -- Select --
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Dropdown;
