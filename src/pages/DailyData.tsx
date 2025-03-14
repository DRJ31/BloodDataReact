import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, DatePicker, message, Modal, Skeleton, Space, Table } from 'antd';
import dayjs, { Dayjs } from "dayjs";
import { renderData } from './MainTable';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import EditDailyForm from "../components/EditDailyForm";
import { RangePickerProps } from "antd/es/date-picker";

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

const DailyData = () => {
    // States
    const [data, setData] = useState<DailyRecord[]>([]);
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(false);
    const [skLoading, setSkLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<DailyRecord | null>(null);
    const [show, setShow] = useState(false);

    // Constants
    const columns = [
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            fixed: true,
            width: 130,
            sorter: (a: DailyRecord, b: DailyRecord) => dayjs(a.time).unix() - dayjs(b.time).unix(),
            render: (text: string) => `${dayjs(text).format("YY-MM-DD")} ${dayjs(text).hour() < 12 ? "上午" : "下午"}`
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
            render: (_text: string, record: DailyRecord) => (
              <div>
                  {renderData(record.pressure_high, [90, 120])}
                  /
                  {renderData(record.pressure_low, [60, 90])}
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
            render: (_text: string, record: DailyRecord) => (
              <Space size="small">
                  <Button
                    type="text"
                    onClick={() => showEditModal(record)}
                  >编辑</Button>
                  <Button
                    type="text"
                    style={{ color: "red" }}
                    onClick={() => showDeleteModal(record)}
                  >删除</Button>
              </Space>
            )
        }
    ];

    // Functions
    const fetchData = () => {
        axios.get("/api/daily")
          .then(response => {
              setSkLoading(false);
              setData(response.data.data);
          })
          .catch(err => {
              setSkLoading(false);
              if (err.response) {
                  message.warning(err.response.data.message);
              }
          });
    }

    const disabledDate: RangePickerProps["disabledDate"] = (current) => {
        return current > dayjs().endOf('day');
    }

    const changeDate = (_date: Dayjs | null | undefined, dateString: string | string[]) => {
        if (typeof dateString === 'string') {
            setMonth(dateString);
        }
    }

    const showDeleteModal = (cur: DailyRecord) => {
        setCurrent(cur);
        setVisible(true);
    }

    const filterData = (data: DailyRecord[], month: string) => {
        if (month.length > 0) {
            const nextMonth = dayjs(month).add(dayjs.duration({ months: 1 }))
            return data.filter(item => dayjs(item.time) >= dayjs(month) && dayjs(item.time) < nextMonth)
        }
        return data;
    }

    const deleteData = (id: number | undefined) => {
        if (typeof id === "undefined") {
            message.error("尚未选定项目");
            return;
        }
        setLoading(true);
        axios.delete(`/api/daily?id=${id}`)
          .then(response => {
              setLoading(false);
              setVisible(false);
              setSkLoading(true);
              fetchData();
              message.success(response.data.message);
          })
          .catch(err => {
              setLoading(false);
              setVisible(false);
              if (err.response) {
                  message.warning(err.response.message);
              }
          })
    }

    const updateData = (values: any) => {
        setLoading(true);
        axios.put("/api/daily", {
            id: current?.id,
            data: values
        }).then(response => {
            setLoading(false);
            setShow(false);
            setSkLoading(true);
            message.success(response.data.message);
            fetchData();
        }).catch(err => {
            setLoading(false);
            if (err.response && err.response.status) {
                message.warning(err.response.data.message);
            } else {
                message.error("提交错误");
            }
        })
    }

    const showEditModal = (record: DailyRecord) => {
        setCurrent(record);
        setShow(true);
    }

    useEffect(() => {
        setSkLoading(true);
        fetchData();
    }, []);

    return (
      <Skeleton active loading={skLoading}>
          <Space size="middle" style={{ float: "left" }}>
              <DatePicker
                picker="month"
                onChange={changeDate}
                disabledDate={disabledDate}
                style={{ float: "left" }}
              />
              <Link to="/input/daily">
                  <Button type="primary">
                      <PlusOutlined/> 添加
                  </Button>
              </Link>
          </Space>
          <br/><br/>
          <Table dataSource={filterData(data, month)} columns={columns} scroll={{ x: 1000, y: '60vh' }} sticky/>
          <Modal
            title="删除确认"
            okButtonProps={{ danger: true }}
            okText="删除"
            cancelText="取消"
            confirmLoading={loading}
            open={visible}
            onCancel={() => setVisible(false)}
            onOk={() => deleteData(current?.id)}
          >
              确认删除 <b>{dayjs(current?.time).format("YYYY-MM-DD HH:mm")}</b> 的记录吗？
          </Modal>
          <EditDailyForm
            open={show}
            setOpen={(bool: boolean) => setShow(bool)}
            onFinish={(values: any) => updateData(values)}
            loading={loading}
            current={current}
          />
      </Skeleton>
    );
}

export default DailyData;
