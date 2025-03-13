import { Form, Input, Button, message, Row, Col } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import encrypt from '../encrypt';
import * as Cookie from "../cookie";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:5004" : "";

const layout = {
    labelCol: { xs: 6, md: 8 },
    wrapperCol: { xs: 18, md: 12, lg: 8 },
};
const tailLayout = {
    wrapperCol: { span: 24 },
};

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        const { username, password } = values;

        setLoading(true);

        axios.post("/api/login", {
            username,
            password: encrypt(password)
        }).then(response => {
            const { message: msg } = response.data;
            message.success(msg);
            setLoading(false);
            navigate("/")
        }).catch(err => {
            setLoading(false);
            if (err.response) {
                message.error(err.response.data.message);
            } else {
                message.error("登录失败");
            }
        })
    }

    const onFinishFailed = (err: any) => {
        message.error("Failed: ", err);
    }

    if (Cookie.getValue("username")) {
        navigate("/");
    }

    return (
        <Row align="middle" style={{ height: "90%" }}>
            <Col sm={24} xs={24}>
                <img src="/vite.svg" className="App-logo" alt="logo" style={{ width: 100, height: 100 }} />
                <Form
                    {...layout}
                    name="Login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "请输入用户名" }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
}

export default LoginPage;
