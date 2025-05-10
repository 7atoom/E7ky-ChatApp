import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">E7ky</h2>
          <p className="auth-subtitle">Create your account</p>
        </div>
        <form onSubmit={registerUser} className="auth-body">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="name">Name</label>
            <input
              id="name"
              className="auth-input"
              type="text"
              placeholder="Your name"
              onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })}
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              placeholder="name@example.com"
              onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}
            />
          </div>
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              placeholder="Create a secure password"
              onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })}
            />
          </div>
          
          {registerError?.error && (
            <div className="auth-alert">{registerError.message}</div>
          )}
          
          <button type="submit" className="auth-button" disabled={isRegisterLoading}>
            {isRegisterLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;