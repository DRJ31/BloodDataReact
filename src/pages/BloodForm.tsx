import {Form, Input, Button, message, Spin, Space} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from '../components/DatePicker';
import axios from 'axios';
import * as Cookie from "../cookie";
import { Link } from 'react-router-dom';

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
}

const SpinIcon = <LoadingOutlined spin style={{ fontSize: 24 }} />

const FormPage = () => {
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState([""])
    const [spin, setSpin] = useState(true);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    axios.post("/api/check")
        .then(() => setSpin(false))
        .catch(err => {
            if (err.response) {
                message.error(err.response.data.message);
            }
            setSpin(false);
            navigate("/login");
        });

    const disabledDate = (current: Dayjs): boolean => {
        return current > dayjs().endOf('day');
    }

    const getDates = () => {
        if (dates.length > 1) {
            return;
        }
        axios.get("/api/blood")
            .then(response => {
                setSpin(false);
                const days = [], data = response.data.data;
                for (let d of data) {
                    days.push(dayjs(d.date).format("YYYY-MM-DD"));
                }
                setDates(days);
            })
            .catch(err => {
                setSpin(false);
                if (err.response) {
                    message.warning(err.response.data.message);
                }
            });
    }

    const fetchData = (date: Dayjs | null, dateString: string) => {
        setSpin(true);
        axios.get(`/api/blood/date?date=${dateString}`)
            .then(response => {
                if (response.data.result) {
                    form.setFieldsValue(response.data.result);
                }
                else {
                    form.resetFields();
                    form.setFieldsValue({ date });
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
        axios.post("/api/blood", {
            data: values
        }).then(response => {
            setLoading(false);
            message.success(response.data.message);
            form.resetFields();
        }).catch(err => {
            setLoading(false);
            if (err.response && err.response.status) {
                message.warning(err.response.data.message);
                if (err.response.status === 401)
                    navigate("/login");
            }
            else {
                message.error("提交错误");
                form.resetFields();
            }
        })
    }

    if (!Cookie.getValue("username")) {
        return <Navigate to="/login" />
    }

    return (
        <Spin tip="加载中..." indicator={SpinIcon} spinning={spin} >
            <Form {...layout} form={form} onFinish={onFinish}>
                <Form.Item name="date" label="日期" rules={[{ required: true, message: "请选择日期" }]}>
                    <DatePicker
                        onClick={getDates}
                        onChange={fetchData}
                        style={{ float: "left" }}
                        disabledDate={disabledDate}
                        dateRender={current => {
                            const style = { border: "", borderRadius: "" };
                            if (dates.indexOf(current.format("YYYY-MM-DD")) !== -1) {
                                style.border = '1px solid #1890ff';
                                style.borderRadius = '50%';
                            }
                            return (
                                <div className="ant-picker-cell-inner" style={style}>
                                    {current.date()}
                                </div>
                            );
                        }}
                    />
                </Form.Item>
                <Form.Item name="leukocyte" label="白细胞" rules={[{ required: true, message: "请输入白细胞数据" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="hemoglobin" label="血红蛋白" rules={[{ required: true, message: "请输入数据" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="platelets" label="血小板" rules={[{ required: true, message: "请输入血小板数据" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="monocyte" label="单核细胞" rules={[{ required: true, message: "请输入单核细胞数据" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="monocyteP" label="单核细胞比例" rules={[{ required: true, message: "请输入单核细胞比例" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="neutrophil" label="中性粒细胞" rules={[{ required: true, message: "请输入中性粒细胞数据" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="reticulocyte" label="网织红细胞">
                    <Input />
                </Form.Item>
                <Form.Item name="remark" label="备注">
                    <Input />
                </Form.Item> 
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Space size="middle">
                        <Button type="primary" htmlType="submit" loading={loading}>
                            提交
                        </Button>
                        <Link to="/">
                            <Button>返回主页</Button>
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
        </Spin>
    )
}

export default FormPage;