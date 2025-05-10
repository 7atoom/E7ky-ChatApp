import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
    useContext(AuthContext);

  return (
    <Form onSubmit={loginUser}>
      <Row
        style={{
          height: "100vh",
          justifyContent: "center",
        }}
        className='align-items-center'>
        <Col xs={6}>
          <Stack gap={3}>
            <h2>Login</h2>
            <Form.Control
              type='email'
              placeholder='Email'
              value={loginInfo.email}
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
            <Form.Control
              type='password'
              placeholder='Password'
              value={loginInfo.password}
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, password: e.target.value })
              }
            />
            <Button variant='primary' type='submit'>
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>

            {loginError?.error && (
              <Alert variant='danger' className='mt-3'>
                {loginError.message}
              </Alert>
            )}
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
