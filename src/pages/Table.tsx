import { Table, Tabs, message, Skeleton, Statistic, Typography, Select } from "antd";
import { Redirect } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { DateChart } from '../Components/DateChart';

axios.defaults.withCredentials = true;

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;


interface ChartData {
    key: string;
    name: string;
    range: [number, number];
}

interface IState {
    data: any | null;
    loading: boolean;
    chartData: ChartData;
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

const chartOptions: ChartData[] = [
    {
        name: "白细胞",
        key: "leukocyte",
        range: [3.5, 9.5]
    },
    {
        name: "血红蛋白",
        key: "hemoglobin",
        range: [130, 175]
    },
    {
        name: "血小板",
        key: "platelets",
        range: [120, 350]
    },
    {
        name: "单核细胞",
        key: "monocyte",
        range: [0.1, 0.6]
    },
    {
        name: "单核细胞比例",
        key: "monocyteP",
        range: [3, 10]
    },
    {
        name: "中性粒细胞",
        key: "neutrophil",
        range: [1.8, 6.3]
    }
]

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        fixed: true,
        width: 120,
        sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
    {
        title: <div>白细胞<br/>[3.5,9.5]</div>,
        dataIndex: 'leukocyte',
        key: 'leukocyte',
        width: 130,
        sorter: (a: any, b: any) => a.leukocyte - b.leukocyte,
        render: (text: string | number) => renderData(text, [3.5, 9.5])
    },
    {
        title: <div>血红蛋白<br/>[130,175]</div>,
        dataIndex: 'hemoglobin',
        key: 'hemoglobin',
        width: 130,
        sorter: (a: any, b: any) => a.hemoglobin - b.hemoglobin,
        render: (text: string | number) => renderData(text, [130, 175])
    },
    {
        title: <div>血小板<br/>[120,350]</div>,
        dataIndex: 'platelets',
        key: 'platelets',
        width: 130,
        sorter: (a: any, b: any) => a.platelets - b.platelets,
        render: (text: string | number) => renderData(text, [125, 350])
    },
    {
        title: <div>单核细胞<br/>[0.1,0.6]</div>,
        dataIndex: 'monocyte',
        key: 'monocyte',
        width: 130,
        sorter: (a: any, b: any) => a.monocyte - b.monocyte,
        render: (text: string | number) => renderData(text, [0.1, 0.6])
    },
    {
        title: <div>单核细胞比例<br/>[3,10]</div>,
        dataIndex: 'monocyteP',
        key: 'monocyteP',
        width: 130,
        sorter: (a: any, b: any) => a.monocyteP - b.monocyteP,
        render: (text: string | number) => renderData(text, [3, 10])
    },
    {
        title: <div>中性粒细胞<br/>[1.8,6.3]</div>,
        dataIndex: 'neutrophil',
        key: 'neutrophil',
        width: 130,
        sorter: (a: any, b: any) => a.neutrophil - b.neutrophil,
        render: (text: string | number) => renderData(text, [1.8, 6.3])
    },
    {
        title: <div>网织红细胞<br/>[24,84]</div>,
        dataIndex: 'reticulocyte',
        key: 'reticulocyte',
        width: 130,
        sorter: (a: any, b: any) => a.reticulocyte - b.reticulocyte,
        render: (text: string | number) => renderData(text, [24, 84])
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 130
    }
];

class TablePage extends React.Component {
    state: IState = {
        data: null,
        loading: false,
        chartData: chartOptions[0]
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get("/api/data")
            .then(response => {
                this.setState({ loading: false, data: response.data.data });
            })
            .catch(err => {
                window.localStorage.removeItem("username");
                this.setState({ loading: false });
                if (err.response) {
                    message.warning(err.response.data.message);
                }
            })
    }

    changeValue = (value: number) => {
        this.setState({ chartData: chartOptions[value] });
    }

    render() {
        const { data, loading, chartData } = this.state;

        if (!window.localStorage.username) {
            return (<Redirect to="/login" />);
        }

        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="数据" key="1">
                        <Skeleton active loading={loading}>
                            <Table dataSource={data} columns={columns} scroll={{ x: 1000 }} sticky />
                        </Skeleton>
                    </TabPane>
                    <TabPane tab="图表" key="2">
                        <Skeleton active loading={loading}>
                            <Select defaultValue={0} onChange={this.changeValue} style={{ float: "left", width: 130 }}>
                                {chartOptions.map((val, i) => (
                                    <Option value={i}>{val.name}</Option>
                                ))}
                            </Select><br/>
                            <Title level={2}>{chartData.name}</Title>
                            <DateChart data={data} k={chartData.key} range={chartData.range} name={chartData.name} />
                        </Skeleton>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default TablePage;