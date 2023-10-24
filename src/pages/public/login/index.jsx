import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import request from "../../../server";
import { TOKEN, USER } from "../../../constants";
import { setAuth } from "../../../redux/slices/auth";
import { useDispatch } from "react-redux";
import { Button, Flex, Form, Input, message } from "antd";
import { useState } from "react";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [btnLoading, setBtnLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setBtnLoading(true);

      const {
        data: { token, user },
      } = await request.post("auth/login", values);

      Cookies.set(TOKEN, token);
      localStorage.setItem(USER, JSON.stringify(user));
      navigate("/dashboard");

      dispatch(setAuth(user));
      message.success("Success login");
    } finally {
      setBtnLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Flex style={{ height: "100vh" }} align="center" justify="center">
      <Form
        name="register"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          width: 800,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your first last username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            loading={btnLoading}
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default LoginPage;
