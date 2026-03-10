function fieldLabel({ label = "", required = false, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-white/80">
          {label}{" "}
          {!!required ? <span className="text-[#c4a8f0]">*</span> : null}
        </label>
        {!!hint ? (
          <span className="text-[11px] text-white/30">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default fieldLabel;
