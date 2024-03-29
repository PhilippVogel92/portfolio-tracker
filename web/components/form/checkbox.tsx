import React, { useState } from "react";

export type CheckboxProps = {
  name: string;
  text: string;
};

export const Checkbox = ({ name, text }: CheckboxProps) => {
  const [active, setActive] = useState(false);

  return (
    <div className="relative text-base form-group my-2">
      <label htmlFor={name}>
        <div
          onClick={() => {
            setActive(!active);
          }}
          className="cursor-pointer flex items-center mr-2"
        >
          <div
            className={`mr-2 rounded-sm w-4 h-4 border-2 border-solid border-white outline ${
              active
                ? "bg-highlight1 outline-highlight1"
                : "outline-highlight1/50 hover:outline-highlight1"
            }`}
          ></div>
          <div className="select-none">{text}</div>
        </div>
        <input className="hidden" type="radio" id={name} name={name}></input>
      </label>
    </div>
  );
};
