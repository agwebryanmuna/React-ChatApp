import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Spinner from "./components/Spinner.jsx";

const HomePage = React.lazy(() => import("./pages/HomePage.jsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage.jsx"));

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Suspense>
        <Routes fallback={<Spinner />}>
          {authUser && <Route path="/" element={<HomePage />} />}

          {!authUser && <Route path="/" element={<Navigate to={"/login"} />} />}
          <Route
            path="/login"
            element={authUser ? <Navigate to={"/"} /> : <LoginPage />}
          />
          <Route
            path="/profile"
            element={!authUser ? <Navigate to={"/login"} /> : <ProfilePage />}
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
