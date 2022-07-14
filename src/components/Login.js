import React, { useState, useContext } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/useContext";

const Login = () => {
  const { loginContext } = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [loadingAPI, setLoadingAPI] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/password is required");
      return;
    }

    setLoadingAPI(true);
    let res = await loginApi(email.trim(), password);
    if (res && res.token) {
      loginContext(email, res.token);
      navigate("/");
    } else {
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    console.log(">>>>>>>>", res);
    setLoadingAPI(false);
  };

  //========================Back ve lai trang HOM===========================
  const handleGoBack = () => {
    navigate("/");
  };

  const handlePress = (e) => {
    if (e && e.key === "Enter") {
      handleLogin();
    }
    console.log(e);
  };

  return (
    <>
      <div className="login-container col-12 col-sm-4">
        <div className="title">Log In</div>
        <div className="text">Email or username eve.holt@reqres.in</div>
        <input
          type="text"
          placeholder="Email or username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="input-container">
          <input
            type={isShowPassword === true ? "text" : "password"}
            placeholder="Password...."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handlePress(e)}
          />
          <i
            className={
              isShowPassword === true
                ? "fa-solid fa-eye"
                : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
        </div>
        <button
          className={email && password ? "active" : ""}
          disabled={email && password ? false : true}
          onClick={() => handleLogin()}
        >
          {loadingAPI && <i class="fa-solid fa-sync fa-spin"></i>}
          &nbsp;Login
        </button>
        <div className="back">
          <i className="fa-solid fa-angle-left"></i>
          <span onClick={() => handleGoBack()}>&nbsp;Go back</span>
        </div>
      </div>
    </>
  );
};

export default Login;
