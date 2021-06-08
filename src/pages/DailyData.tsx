import React from 'react';
import axios from 'axios';
import {message, Skeleton, Table, Space, Button, Modal} from 'antd';
import DatePicker from "../components/DatePicker";
import dayjs, {Dayjs} from "dayjs";
import { renderData } from './MainTable';
import {Link} from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import EditDailyForm from "../components/EditDailyForm";

interface DailyRecord {
    id: number,
    uid: number,
    temperature: number,
    oxygen: number,
    pressure_high: number,
    pressure_low: number,
    heart_rate: number,
    weight?: number,
    time: string
}

interface IState {
    data: DailyRecord[],
    month: string,
    loading: boolean,
    visible: boolean,
    current: DailyRecord | null,
    show: boolean
}

class DailyData extends React.Component {
    state: IState = {
        data: [],
        month: "",
        loading: false,
        visible: false,
        current: null,
        show: false
    }

    componentDidMount() {
        this.setState({ loading: true});
        this.fetchData();
    }

    columns = [
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            fixed: true,
            width: 130,
            sorter: (a: DailyRecord, b: DailyRecord) => dayjs(a.time).unix() - dayjs(b.time).unix(),
            render: (text: string) =>  `${dayjs(text).format("YY-MM-DD")} ${dayjs(text).hour() < 12 ? "上午" : "下午"}`
        },
        {
            title: '体温',
            dataIndex: 'temperature',
            key: 'temperature',
            width: 100,
            render: (text: string | number) => renderData(text, [36, 37.3])
        },
        {
            title: '血氧',
            dataIndex: 'oxygen',
            key: 'oxygen',
            width: 100,
            render: (text: string | number) => renderData(text, [95, 100])
        },
        {
            title: <div>血压<br/>[90-120]/[60-90]</div>,
            width: 100,
            key: 'blood_pressure',
            render: (text: string, record: DailyRecord) => (
                <div>
                    {renderData(record.pressure_high, [90, 120])}
                    /
                    {renderData(record.pressure_low, [60, 90]) }
                </div>
            )
        },
        {
            title: '心率',
            dataIndex: 'heart_rate',
            key: 'heart_rate',
            width: 100
        },
        {
            title: '体重',
            dataIndex: 'weight',
            key: 'weight',
            width: 100,
            render: (text: number) => text === 0 ? "" : text
        },
        {
            title: '操作',
            key: 'action',
            width: 130,
            render: (text: string, record: DailyRecord) => (
                <Space size="small">
                    <Button
                        type="text"
                        onClick={() => this.showEditModal(record)}
                    >编辑</Button>
                    <Button
                        type="text"
                        style={{ color: "red" }}
                        onClick={() => this.showDeleteModal(record)}
                    >删除</Button>
                </Space>
            )
        }
    ];

    fetchData = () => {
        axios.get("http://localhost:5000/api/daily")
            .then(response => {
                this.setState({
                    loading: false,
                    data: response.data.data
                })
            })
            .catch(err => {
                this.setState({ loading: false });
                if (err.response) {
                    message.warning(err.response.data.message);
                }
            });
    }

    disabledDate = (current: Dayjs): boolean => {
        return current > dayjs().endOf('day');
    }

    changeDate = (date: Dayjs | null, dateString: string) => {
        this.setState({ month: dateString })
    }

    showDeleteModal = (current: DailyRecord) => {
        this.setState({ visible: true, current });
    }

    filterData = (data: DailyRecord[], month: string) => {
        if (month.length > 0) {
            const nextMonth = dayjs(month).add(dayjs.duration({ months: 1 }))
            return data.filter(item => dayjs(item.time) >= dayjs(month) && dayjs(item.time) < nextMonth)
        }
        return data;
    }

    deleteData = (id: number | undefined) => {
        if (typeof id === undefined) {
            message.error("尚未选定项目");
            return;
        }
        this.setState({ loading: true });
        axios.delete(`http://localhost:5000/api/daily?id=${id}`)
            .then(response => {
                this.setState({ visible: false });
                this.fetchData();
                message.success(response.data.message);
            })
            .catch(err => {
                this.setState({ loading: false, visible: false });
                if (err.response) {
                    message.warning(err.response.message);
                }
            })
    }
    
    updateData = (values: any) => {
        const { current } = this.state;

        this.setState({ loading: true });
        axios.put("http://localhost:5000/api/daily", {
            id: current?.id,
            data: values
        }).then(response => {
            this.setState({ loading: false, show: false });
            message.success(response.data.message);
            this.fetchData();
        }).catch(err => {
            this.setState({ loading: false });
            if (err.response && err.response.status) {
                message.warning(err.response.data.message);
            }
            else {
                message.error("提交错误");
            }
        })
    }

    showEditModal = (record: DailyRecord) => {
        this.setState({ current: record, show: true })
    }

    render() {
        const { data, loading, month, current, visible, show } = this.state;

        return (
            <Skeleton active loading={loading}>
                <Space size="middle" style={{ float: "left" }}>
                    <DatePicker picker="month" onChange={this.changeDate} disabledDate={this.disabledDate} style={{ float: "left" }} />
                    <Link to="/input/daily">
                        <Button type="primary">
                            <PlusOutlined /> 添加
                        </Button>
                    </Link>
                </Space>
                <br/><br/>
                <Table dataSource={this.filterData(data, month)} columns={this.columns} scroll={{ x: 1000 }} sticky />
                <Modal
                    title="删除确认"
                    okButtonProps={{ danger: true }}
                    okText="删除"
                    cancelText="取消"
                    confirmLoading={loading}
                    visible={visible}
                    onCancel={() => this.setState({ visible: false })}
                    onOk={() => this.deleteData(current?.id)}
                >
                    确认删除 <b>{dayjs(current?.time).format("YYYY-MM-DD HH:mm")}</b> 的记录吗？
                </Modal>
                <EditDailyForm
                    visible={show}
                    setVisible={(bool: boolean) => this.setState({ show: bool })}
                    onFinish={(values: any) => this.updateData(values)}
                    loading={loading}
                    current={current}
                />
            </Skeleton>
        );
    }
}

export default DailyData;