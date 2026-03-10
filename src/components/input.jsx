import React, { useId } from "react";

function input(
  {
    label,
    type = "text",
    placeholder = "Please enter value",
    className = "",
    hasError = false,
    readonly = false,
    ...props
  },
  ref,
) {
  const InputId = useId();

  return (
    <>
      <div>
        {label ? <label htmlFor={InputId}>{label} </label> : null}
        <input
          id={InputId}
          type={type}
          readOnly={readonly}
          placeholder={placeholder}
          ref={ref}
          className={`w-full bg-white/[0.07] border rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-200
          ${
            hasError
              ? "border-red-500 focus:border-red-400 bg-red-500/10" // ← red state
              : "border-white/10 focus:border-[#7c5cbf] focus:bg-[#7c5cbf]/10" // ← normal state
          } ${className}`}
          {...props}
        ></input>
      </div>
    </>
  );
}

export default React.forwardRef(input);
