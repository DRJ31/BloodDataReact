import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { offset: 5, span: 8 },
};

class LoginPage extends React.Component {
    state = {
        redirect: null,
        loading: false
    }

    onFinish = (values: any): void => {
        const { username, password } = values;

        this.setState({ loading: true });

        axios.post("http://localhost:5000/api/login", {
            username,
            password
        }).then(response => {
            const { username, message: msg } = response.data;
            window.localStorage.setItem("username", username);
            message.success(msg);
            this.setState({ redirect: <Redirect to="/" />, loading: false });
        }).catch(err => {
            this.setState({ loading: false });
            if (err.response) {
                message.error(err.response.data.message);
            }
            else {
                message.error("Login Failed");
            }
        })
    }

    onFinishFailed = (err: any): void => {
        message.error("Failed: ", err);
    }

    render() {
        const { redirect, loading } = this.state;

        if (window.localStorage.username) {
            this.setState({ redirect: <Redirect to="/" /> });
        }

        return (
            <Form
                {...layout}
                name="Login"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
            >
                {redirect}
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please input username!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input password!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default LoginPage;