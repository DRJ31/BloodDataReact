import { Form, Input, Button, message } from 'antd';
import { Redirect, useHistory } from 'react-router-dom';
import { useState } from 'react';
import DatePicker from '../components/DatePicker';
import axios from 'axios';

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
}

const FormPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();

    const onFinish = (values: any) => {
        setLoading(true);
        axios.post("/api/insert", {
            data: values
        }).then(response => {
            setLoading(false);
            message.success(response.data.message);
            form.resetFields();
        }).catch(err => {
            setLoading(false);
            if (err.response && err.response.status) {
                message.warning(err.response.data.message);
                if (err.response.status === 403)
                    history.push("/login");
            }
            else {
                message.error("提交错误");
                form.resetFields();
            }
        })
    }

    if (!window.localStorage.username) {
        return <Redirect to="/login" />
    }

    return (
        <Form {...layout} form={form} onFinish={onFinish}>
            <Form.Item name="date" label="日期" rules={[{ required: true }]} wrapperCol={{ span: 24 }}>
                <DatePicker />
            </Form.Item>
            <Form.Item name="leukocyte" label="白细胞" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="hemoglobin" label="血红蛋白" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="platelets" label="血小板" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="monocyte" label="单核细胞" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="monocyteP" label="单核细胞比例" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="neutrophil" label="中性粒细胞" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="reticulocyte" label="网织红细胞">
                <Input />
            </Form.Item>
            <Form.Item name="remark" label="备注">
                <Input />
            </Form.Item> 
            <Form.Item wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
            </Form.Item>
        </Form>
    )
}

export default FormPage;