import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "./appwrite/auth";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/features/authSlice";
import Header from "./layouts/Header";

function App() {
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((useData) => {
        if (useData) {
          dispatch(login(useData));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(logout());
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  return !loader ? (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  ) : (
    <div className="min-h-screen bg-[#0e0e1c] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7c5cbf] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default App;
