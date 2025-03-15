import {Form, Input, Modal} from "antd";
import axios from "axios";
import { useEffect } from "react";

axios.defaults.withCredentials = true;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 }
}

const EditDailyForm = (props: any) => {
    const { open, onFinish, setOpen, loading, current } = props;
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            temperature: current?.temperature,
            oxygen: current?.oxygen,
            pressure_high: current?.pressure_high,
            pressure_low: current?.pressure_low,
            heart_rate: current?.heart_rate,
            weight: current?.weight === 0 ? "" : current?.weight
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current]);

    return (
        <Modal
            title="编辑记录"
            okText="更新"
            cancelText="取消"
            open={open}
            confirmLoading={loading}
            onCancel={() => setOpen(false)}
            onOk={form.submit}
        >
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
            </Form>
        </Modal>
    )
}

export default EditDailyForm;
