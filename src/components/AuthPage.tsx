import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import "./AuthPage.css";
import { loginUser } from "../modules/thunks/auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../modules/store";

// Определяем тип данных ответа, который возвращается с сервера

export const AuthPage: FC = () => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleAuth = () => {
    dispatch(loginUser({ login, password }))
      .unwrap()
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("login", login);
        navigate(ROUTES.HOME);
        console.log(loading)
      })
      .catch(() => {
        
      });
  };

  return (
    <div className="space-auth">
      <div className="super-header">
        <Link to={ROUTES.START}>
          <button className="home-button"></button>
        </Link>
        <Link to={ROUTES.HOME} className="no-underline">
          <h2 className="h2-auth-prods-auth">Карты</h2>
        </Link>
      </div>

      <div className="container-auth">
        <div className="container-header-auth">
          <Link to={ROUTES.REGISTER} className="no-underline-auth">
            <span className="h2-auth-to-reg">Регистрация</span>
          </Link>
          <span> / Авторизация</span>
        </div>

        <div className="container-data-auth">
          <div className="container-data-auth-login">
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div className="container-data-auth-password">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button className="button-auth" onClick={handleAuth}>
            Авторизоваться
          </button>
        </div>
      </div>
    </div>
  );
};