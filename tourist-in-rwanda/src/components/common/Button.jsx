import { Link } from "react-router-dom";

export default function Button({
  children,
  to,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition focus:outline-none";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg",
  };
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-dark hover:bg-secondary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10",
  };

  const disabledCls = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${disabledCls} ${className}`;

  if (to && !disabled) return <Link to={to} className={cls}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}