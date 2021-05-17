import { Form, Input, Button, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Redirect, useHistory } from 'react-router-dom';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from '../components/DatePicker';
import axios from 'axios';
import Cookie from "../cookie";

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
}

const SpinIcon = <LoadingOutlined spin style={{ fontSize: 24 }} />

const FormPage = () => {
    const [loading, setLoading] = useState(false);
    const [spin, setSpin] = useState(true);
    const [form] = Form.useForm();
    const history = useHistory();

    axios.post("/api/check")
        .then(() => setSpin(false))
        .catch(err => {
            if (err.response) {
                message.error(err.response.data.message);
            }
            setSpin(false);
            history.push("/login");
        });
    
    const disabledDate = (current: Dayjs): boolean => {
        return current > dayjs().endOf('day');
    }

    const fetchData = (date: Dayjs | null, dateString: string) => {
        setSpin(true);
        axios.post("/api/fetch", { date: dateString })
            .then(response => {
                if (response.data.result) {
                    form.setFieldsValue(response.data.result);
                }
                setSpin(false);
            })
            .catch(err => {
                console.log(err);
                setSpin(false);
            });
    }

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

    if (!Cookie.getValue("username")) {
        return <Redirect to="/login" />
    }

    return (
        <Spin tip="加载中..." indicator={SpinIcon} spinning={spin} >
            <Form {...layout} form={form} onFinish={onFinish}>
                <Form.Item name="date" label="日期" rules={[{ required: true }]}>
                    <DatePicker onChange={fetchData} style={{ float: "left" }} disabledDate={disabledDate} />
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
        </Spin>
    )
}

export default FormPage;