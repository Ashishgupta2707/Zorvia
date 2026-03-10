import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loading, setLoader] = useState(true);
  const authState = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (authentication && authState !== authentication) {
      navigate("/login");
    } else if (!authentication && authState !== authentication) {
      navigate("/");
    }

    setLoader(false);
  }, [authState, navigate, authentication]);

  return loading ? (
    <div className="min-h-screen bg-[#0e0e1c] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7c5cbf] border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
