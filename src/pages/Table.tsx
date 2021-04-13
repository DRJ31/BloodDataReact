import { Table, Tabs, message, Skeleton, Statistic, Typography } from "antd";
import { Redirect } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';

axios.defaults.withCredentials = true;

const { TabPane } = Tabs;
const { Title } = Typography;

function DateLineChart(props: { data: any | null, k: string }) {
    const { data, k } = props;
    data.sort((a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix());
    data.forEach((v: any, i: number) => {
        data[i].date = dayjs(v.date).format('YYYY-MM-DD');
    });

    const config = {
        data,
        height: 400,
        xField: 'date',
        yField: k,
        point: {
          size: 5,
          shape: 'diamond',
        },
        slider: {
            start: 0.7,
            end: 1.0,
        }
      };

    return <Line {...config} />
}

function renderData(data: string | number, range: [number, number]) {
    if (typeof data == "string" && data.length === 0)
        return "";
    if (data < range[0]) {
        return (<Statistic 
                    value={data} 
                    valueStyle={{ color: "#cf1322", fontSize: "14px" }} 
                    suffix={<ArrowDownOutlined />}
                />);
    }
    else if (data > range[1]) {
        return (<Statistic 
                    value={data} 
                    valueStyle={{ color: "#cf1322", fontSize: "14px" }} 
                    suffix={<ArrowUpOutlined />}
                />);
    }
    return data;
}

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
    {
        title: '白细胞',
        dataIndex: 'leukocyte',
        key: 'date',
        sorter: (a: any, b: any) => a.leukocyte - b.leukocyte,
        render: (text: string | number) => renderData(text, [3.5, 9.5])
    },
    {
        title: '血红蛋白',
        dataIndex: 'hemoglobin',
        key: 'date',
        sorter: (a: any, b: any) => a.hemoglobin - b.hemoglobin,
        render: (text: string | number) => renderData(text, [130, 175])
    },
    {
        title: '血小板',
        dataIndex: 'platelets',
        key: 'date',
        sorter: (a: any, b: any) => a.platelets - b.platelets,
        render: (text: string | number) => renderData(text, [125, 350])
    },
    {
        title: '单核细胞',
        dataIndex: 'monocyte',
        key: 'date',
        sorter: (a: any, b: any) => a.monocyte - b.monocyte,
        render: (text: string | number) => renderData(text, [0.1, 0.6])
    },
    {
        title: '单核细胞比例',
        dataIndex: 'monocyteP',
        key: 'date',
        sorter: (a: any, b: any) => a.monocyteP - b.monocyteP,
        render: (text: string | number) => renderData(text, [3, 10])
    },
    {
        title: '中性粒细胞',
        dataIndex: 'neutrophil',
        key: 'date',
        sorter: (a: any, b: any) => a.neutrophil - b.neutrophil,
        render: (text: string | number) => renderData(text, [1.8, 6.3])
    },
    {
        title: '网织红细胞',
        dataIndex: 'reticulocyte',
        key: 'date',
        sorter: (a: any, b: any) => a.reticulocyte - b.reticulocyte,
        render: (text: string | number) => renderData(text, [24, 84])
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'date'
    }
];

interface IState {
    data: any | null
    loading: boolean
}

class TablePage extends React.Component {
    state: IState = {
        data: null,
        loading: false
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get("http://localhost:5000/api/data")
            .then(response => {
                this.setState({ loading: false, data: response.data.data });
            })
            .catch(err => {
                window.localStorage.removeItem("username");
                this.setState({ loading: false });
                if (err.response) {
                    message.error(err.response.data.message);
                }
            })
    }

    render() {
        const { data, loading } = this.state;

        if (!window.localStorage.username) {
            return (<Redirect to="/login" />);
        }

        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="数据" key="1">
                        <Skeleton active loading={loading}>
                            <Table dataSource={data} columns={columns} />
                        </Skeleton>
                    </TabPane>
                    <TabPane tab="图表" key="2">
                        <Skeleton active loading={loading}>
                            <Title level={2}>血小板</Title>
                            <DateLineChart data={data} k="platelets" /><br/>
                            <Title level={2}>血红蛋白</Title>
                            <DateLineChart data={data} k="hemoglobin" /><br/>
                            <Title level={2}>白细胞</Title>
                            <DateLineChart data={data} k="leukocyte" /><br/>
                        </Skeleton>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default TablePage;