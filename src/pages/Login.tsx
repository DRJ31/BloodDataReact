import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import React, {useState} from 'react';
import encrypt from '../encrypt';
import * as Cookie from "../cookie";
import {useNavigate} from "react-router-dom";

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { span: 24 },
};

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

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
            }
            else {
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
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "请输入密码" }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
            </Form.Item>
        </Form>
    );
}

export default LoginPage;