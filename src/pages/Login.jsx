import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } = useContext(AuthContext);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">E7ky</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        <form onSubmit={loginUser} className="auth-body">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="name@example.com"
              value={loginInfo.email}
              onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })}
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={loginInfo.password}
              onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })}
            />
          </div>
          
          {loginError?.error && (
            <div className="auth-alert">{loginError.message}</div>
          )}
          
          <button type="submit" className="auth-button" disabled={isLoginLoading}>
            {isLoginLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;