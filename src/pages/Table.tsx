import { Table, Tabs, message, Skeleton, Statistic, Typography, Select, Timeline } from "antd";
import { Redirect } from "react-router-dom";
import React from 'react';
import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import duration from 'dayjs/plugin/duration'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { DateChart } from '../components/DateChart';
import * as Cookie from "../cookie";

axios.defaults.withCredentials = true;

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

dayjs.extend(duration)

interface ChartData {
    key: string;
    name: string;
    range: [number, number];
}

interface BloodData {
    id: number;
    uid: number;
    date: string;
    leukocyte: number;
    hemoglobin: number;
    platelets: number;
    monocyte: number;
    monocyteP: number;
    neutrophil: number;
    reticulocyte: string;
    remark: string;
}

interface IState {
    data: BloodData[];
    loading: boolean;
    chartData: ChartData;
}

function renderData(data: string | number, range: [number, number]) {
    if (typeof data == "string" && data.length === 0)
        return "";
    if (data < range[0]) {
        return <Statistic 
                    value={data} 
                    valueStyle={{ color: "#cf1322", fontSize: "14px" }} 
                    suffix={<ArrowDownOutlined />}
                />;
    }
    else if (data > range[1]) {
        return <Statistic 
                    value={data} 
                    valueStyle={{ color: "#cf1322", fontSize: "14px" }} 
                    suffix={<ArrowUpOutlined />}
                />;
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
        name: "中性粒细胞",
        key: "neutrophil",
        range: [1.8, 6.3]
    },
    {
        name: "单核细胞比例",
        key: "monocyteP",
        range: [3, 10]
    },
    {
        name: "单核细胞",
        key: "monocyte",
        range: [0.1, 0.6]
    },
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
        title: <div>白细胞<br/>[3.5-9.5]</div>,
        dataIndex: 'leukocyte',
        key: 'leukocyte',
        width: 130,
        sorter: (a: any, b: any) => a.leukocyte - b.leukocyte,
        render: (text: string | number) => renderData(text, [3.5, 9.5])
    },
    {
        title: <div>血红蛋白<br/>[130-175]</div>,
        dataIndex: 'hemoglobin',
        key: 'hemoglobin',
        width: 130,
        sorter: (a: any, b: any) => a.hemoglobin - b.hemoglobin,
        render: (text: string | number) => renderData(text, [130, 175])
    },
    {
        title: <div>血小板<br/>[120-350]</div>,
        dataIndex: 'platelets',
        key: 'platelets',
        width: 130,
        sorter: (a: any, b: any) => a.platelets - b.platelets,
        render: (text: string | number) => renderData(text, [125, 350])
    },
    {
        title: <div>中性粒细胞<br/>[1.8-6.3]</div>,
        dataIndex: 'neutrophil',
        key: 'neutrophil',
        width: 130,
        sorter: (a: any, b: any) => a.neutrophil - b.neutrophil,
        render: (text: string | number) => renderData(text, [1.8, 6.3])
    },
    {
        title: <div>单核细胞比例<br/>[3-10]</div>,
        dataIndex: 'monocyteP',
        key: 'monocyteP',
        width: 130,
        sorter: (a: any, b: any) => a.monocyteP - b.monocyteP,
        render: (text: string | number) => text === 0 ? "" : renderData(text, [3, 10])
    },
    {
        title: <div>单核细胞<br/>[0.1-0.6]</div>,
        dataIndex: 'monocyte',
        key: 'monocyte',
        width: 130,
        sorter: (a: any, b: any) => a.monocyte - b.monocyte,
        render: (text: string | number) => text === 0 ? "" : renderData(text, [0.1, 0.6])
    },
    {
        title: <div>网织红细胞<br/>[24-84]</div>,
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
        data: [],
        loading: false,
        chartData: chartOptions[0]
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get("/api/data")
            .then(response => {
                this.setState({
                    loading: false,
                    data: response.data.data,
                });
            })
            .catch(err => {
                this.setState({ loading: false });
                if (err.response) {
                    message.warning(err.response.data.message);
                }
            })
    }

    changeValue = (value: number) => {
        this.setState({ chartData: chartOptions[value] });
    }

    getDateDelta = (i: number, current: Dayjs, arr: BloodData[]): string => {
        if (arr[i]) {
            const days = Math.floor(dayjs.duration(current.diff(dayjs(arr[i].date))).asDays())
            return `(${days}天前)`
        }
        return ""
    }

    dateCmp = (a: BloodData, b: BloodData) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()

    render() {
        const { data, loading, chartData } = this.state;

        if (!Cookie.getValue("username")) {
            return (<Redirect to="/login" />);
        }

        // @ts-ignore
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="数据" key="1"  style={{ height: window.innerHeight - 170, overflow: "auto" }}>
                        <Skeleton active loading={loading}>
                            <Table dataSource={data} columns={columns} scroll={{ x: 1000 }} sticky />
                        </Skeleton>
                    </TabPane>
                    <TabPane tab="图表" key="2"  style={{ height: window.innerHeight - 170, overflow: "auto" }}>
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
                    <TabPane tab="输细胞间隔" key="3"  style={{ height: window.innerHeight - 170, overflow: "auto" }}>
                        <Skeleton active loading={loading}>
                            <Tabs defaultActiveKey="11" tabPosition="left">
                                <TabPane tab="血红蛋白" key="11"  style={{ height: window.innerHeight - 170, overflow: "auto" }}>
                                    <br/>
                                    <Timeline mode="left" style={{ paddingRight: "1em" }}>
                                        <Timeline.Item label={dayjs().format("YYYY-MM-DD")}>
                                            今天 {this.getDateDelta(0, dayjs(), data.sort(this.dateCmp).filter((item) => item.remark.match("血红蛋白")))}
                                        </Timeline.Item>
                                        {data.sort(this.dateCmp).filter((item) => item.remark.match("血红蛋白")).map((val, i, arr) => (
                                            <Timeline.Item label={dayjs(val.date).format("YYYY-MM-DD")}>
                                                {val.remark} {this.getDateDelta(i + 1, dayjs(val.date), arr)}
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </TabPane>
                                <TabPane tab="血小板" key="12"  style={{ height: window.innerHeight - 170, overflow: "auto" }}>
                                    <Timeline mode="left" style={{ paddingRight: "1em" }}>
                                        <br/>
                                        <Timeline.Item label={dayjs().format("YYYY-MM-DD")}>
                                            今天 {this.getDateDelta(0, dayjs(), data.sort(this.dateCmp).filter((item) => item.remark.match("血小板")))}
                                        </Timeline.Item>
                                        {data.sort(this.dateCmp).filter((item) => item.remark.match("血小板")).map((val, i, arr) => (
                                            <Timeline.Item label={dayjs(val.date).format("YYYY-MM-DD")}>
                                                {val.remark} {this.getDateDelta(i + 1, dayjs(val.date), arr)}
                                            </Timeline.Item>
                                        ))}
                                    </Timeline>
                                </TabPane>
                            </Tabs>
                        </Skeleton>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default TablePage;