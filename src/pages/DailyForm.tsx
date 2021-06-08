import axios from "axios";
import {Button, Form, Input, message, Modal, Space, Spin} from "antd";
import {Link, Redirect, useHistory} from "react-router-dom";
import {useState} from "react";
import * as Cookie from "../cookie";
import {LoadingOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
}

const SpinIcon = <LoadingOutlined spin style={{ fontSize: 24 }} />

const DailyForm = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState(<div>Null</div>);
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

    const onFinish = (values: any) => {
        setLoading(true);
        values["time"] = dayjs().format("YYYY-MM-DD HH:mm:ss")
        axios.post("/api/daily", {
            data: values
        }).then(response => {
            setLoading(false);
            setVisible(false);
            message.success(response.data.message);
            form.resetFields();
        }).catch(err => {
            setLoading(false);
            if (err.response && err.response.status) {
                message.warning(err.response.data.message);
                if (err.response.status === 401)
                    history.push("/login");
            }
            else {
                message.error("提交错误");
                form.resetFields();
            }
        });
    }

    const showModal = () => {
        setVisible(true);
        form.validateFields()
            .then(values => {
                setText(() => (
                    <div>
                        <p><b>体温</b>: {values.temperature}</p>
                        <p><b>血氧</b>: {values.oxygen}</p>
                        <p><b>血压</b>: {values.pressure_high}/{values.pressure_low}</p>
                        <p><b>心率</b>: {values.heart_rate}</p>
                        <p><b>体重</b>: {values.weight || ""}</p>
                    </div>
                ));
            });
    }

    if (!Cookie.getValue("username")) {
        return <Redirect to="/login" />
    }

    return (
        <Spin tip="加载中..." indicator={SpinIcon} spinning={spin}>
            <Form {...layout} form={form} onFinish={onFinish}>
                <Form.Item name="temperature" label="体温" rules={[{ required: true, message: "请输入体温" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="oxygen" label="血氧" rules={[{ required: true, message: "请输入血氧" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="pressure_high" label="血压（高压）" rules={[{ required: true, message: "请输入血压（高压）" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="pressure_low" label="血压（低压）" rules={[{ required: true, message: "请输入血压（低压）" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="heart_rate" label="心率" rules={[{ required: true, message: "请输入心率" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="weight" label="体重">
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Space size="middle">
                        <Button type="primary" onClick={showModal}>
                            提交
                        </Button>
                        <Link to="/">
                            <Button>返回主页</Button>
                        </Link>
                    </Space>
                </Form.Item>
            </Form>
            <Modal
                title="确认提交"
                visible={visible}
                onOk={() => form.submit()}
                okText="确认"
                cancelText="取消"
                confirmLoading={loading}
                onCancel={() => setVisible(false)}
            >
                {text}
            </Modal>
        </Spin>
    )
};

export default DailyForm;