import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleLoginRedux } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const isLoading = useSelector((state) => state.user.isLoading);
  const account = useSelector((state) => state.user.account);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email/password is required");
      return;
    }

    dispatch(handleLoginRedux(email, password));
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
  useEffect(() => {
    if (account && account.auth === true) {
      navigate("/");
    }
  }, [account]);

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
          {isLoading && <i class="fa-solid fa-sync fa-spin"></i>}
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
