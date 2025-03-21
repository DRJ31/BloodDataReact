import {Table, Tabs, message, Skeleton, Statistic, Typography, Select, Timeline, Button} from "antd";
import { Navigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import duration from 'dayjs/plugin/duration'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { DateChart } from '../components/DateChart';
import * as Cookie from "../cookie";
import DailyData from "./DailyData";

axios.defaults.withCredentials = true;

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

export function renderData(data: string | number, range: [number, number]) {
    if (typeof data == "string" && data.length === 0)
        return "";
    if (typeof data == "number" && data < range[0]) {
        return <Statistic
                    value={data}
                    valueStyle={{ color: "#cf1322", fontSize: "14px" }}
                    suffix={<ArrowDownOutlined />}
                />;
    }
    else if (typeof data == "number" && data > range[1]) {
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
        sorter: (a: BloodData, b: BloodData) => dayjs(a.date).unix() - dayjs(b.date).unix(),
        render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    },
    {
        title: <div>白细胞<br/>[3.5-9.5]</div>,
        dataIndex: 'leukocyte',
        key: 'leukocyte',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => a.leukocyte - b.leukocyte,
        render: (text: string | number) => renderData(text, [3.5, 9.5])
    },
    {
        title: <div>血红蛋白<br/>[130-175]</div>,
        dataIndex: 'hemoglobin',
        key: 'hemoglobin',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => a.hemoglobin - b.hemoglobin,
        render: (text: string | number) => renderData(text, [130, 175])
    },
    {
        title: <div>血小板<br/>[120-350]</div>,
        dataIndex: 'platelets',
        key: 'platelets',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => a.platelets - b.platelets,
        render: (text: string | number) => renderData(text, [125, 350])
    },
    {
        title: <div>中性粒细胞<br/>[1.8-6.3]</div>,
        dataIndex: 'neutrophil',
        key: 'neutrophil',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => a.neutrophil - b.neutrophil,
        render: (text: string | number) => renderData(text, [1.8, 6.3])
    },
    {
        title: <div>单核细胞比例<br/>[3-10]</div>,
        dataIndex: 'monocyteP',
        key: 'monocyteP',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => a.monocyteP - b.monocyteP,
        render: (text: string | number) => text === 0 ? "" : renderData(text, [3, 10])
    },
    {
        title: <div>单核细胞<br/>[0.1-0.6]</div>,
        dataIndex: 'monocyte',
        key: 'monocyte',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => a.monocyte - b.monocyte,
        render: (text: string | number) => text === 0 ? "" : renderData(text, [0.1, 0.6])
    },
    {
        title: <div>网织红细胞<br/>[24-84]</div>,
        dataIndex: 'reticulocyte',
        key: 'reticulocyte',
        width: 130,
        sorter: (a: BloodData, b: BloodData) => parseFloat(a.reticulocyte) - parseFloat(b.reticulocyte),
        render: (text: string | number) => renderData(text, [24, 84])
    },
    {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 130
    }
];

const TablePage = () => {
    // States
    const [data, setData] = useState<BloodData[]>([]);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState<ChartData>(chartOptions[0]);

    // Functions
    const changeValue = (value: number) => {
        setChartData(chartOptions[value]);
    }

    const getDateDelta = (i: number, current: Dayjs, arr: BloodData[]): string => {
        if (arr[i]) {
            const days = Math.floor(dayjs.duration(current.diff(dayjs(arr[i].date))).asDays())
            return `(${days}天前)`
        }
        return ""
    }

    const dateCmp = (a: BloodData, b: BloodData) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()

    // Constants
    const subItems = [
        {
            key: '11',
            label: '血红蛋白',
            children: <Timeline mode="left" style={{ paddingRight: "1em", paddingTop: "1em", height: '80vh', overflow: "auto" }}>
                <Timeline.Item label={dayjs().format("YYYY-MM-DD")}>
                    今天 {getDateDelta(0, dayjs(), data.sort(dateCmp).filter((item) => item.remark.match("血红蛋白")))}
                </Timeline.Item>
                {data.sort(dateCmp).filter((item) => item.remark.match("血红蛋白")).map((val, i, arr) => (
                  <Timeline.Item label={dayjs(val.date).format("YYYY-MM-DD")}>
                      {val.remark} {getDateDelta(i + 1, dayjs(val.date), arr)}
                  </Timeline.Item>
                ))}
            </Timeline>,
        },
        {
            key: '12',
            label: '血小板',
            children: <Timeline mode="left" style={{ paddingRight: "1em", paddingTop: "1em", height: '80vh', overflow: "auto" }}>
                <Timeline.Item label={dayjs().format("YYYY-MM-DD")}>
                    今天 {getDateDelta(0, dayjs(), data.sort(dateCmp).filter((item) => item.remark.match("血小板")))}
                </Timeline.Item>
                {data.sort(dateCmp).filter((item) => item.remark.match("血小板")).map((val, i, arr) => (
                  <Timeline.Item label={dayjs(val.date).format("YYYY-MM-DD")}>
                      {val.remark} {getDateDelta(i + 1, dayjs(val.date), arr)}
                  </Timeline.Item>
                ))}
            </Timeline>,
        },
        {
            key: '13',
            label: '白细胞',
            children: <Timeline mode="left" style={{ paddingRight: "1em", paddingTop: "1em", height: '80vh', overflow: "auto" }}>
                <Timeline.Item label={dayjs().format("YYYY-MM-DD")}>
                    今天 {getDateDelta(0, dayjs(), data.sort(dateCmp).filter((item) => item.remark.match("升白针")))}
                </Timeline.Item>
                {data.sort(dateCmp).filter((item) => item.remark.match("升白针")).map((val, i, arr) => (
                  <Timeline.Item label={dayjs(val.date).format("YYYY-MM-DD")}>
                      {val.remark} {getDateDelta(i + 1, dayjs(val.date), arr)}
                  </Timeline.Item>
                ))}
            </Timeline>,
        }
    ];

    const items = [
        {
            key: '1',
            label: '血常规数据',
            children: <Skeleton active loading={loading}>
                <Link to="/input/blood">
                    <Button style={{ float: "left" }} type="primary">
                        添加 / 编辑
                    </Button>
                </Link>
                <br/><br/>
                <Table dataSource={data} columns={columns} scroll={{ x: 1000, y: '60vh' }} sticky />
            </Skeleton>,
        },
        {
            key: '2',
            label: '血常规图表',
            children: <Skeleton active loading={loading}>
                <Select defaultValue={0} onChange={changeValue} style={{ float: "left", width: 130 }}>
                    {chartOptions.map((val, i) => (
                      <Option value={i}>{val.name}</Option>
                    ))}
                </Select><br/>
                <Title level={2}>{chartData.name}</Title>
                <DateChart data={data} k={chartData.key} range={chartData.range} name={chartData.name} />
            </Skeleton>,
        },
        {
            key: '3',
            label: '输细胞间隔',
            children: <Skeleton active loading={loading}>
                <Tabs defaultActiveKey="11" tabPosition="left" items={subItems}/>
            </Skeleton>,
        },
        {
            key: '4',
            label: '日常数据',
            children: <DailyData/>,
        }
    ];

    useEffect(() => {
        setLoading(true);
        axios.get("/api/blood")
          .then(response => {
              setLoading(false);
              setData(response.data.data);
          })
          .catch(err => {
              setLoading(false);
              if (err.response) {
                  message.warning(err.response.data.message);
              }
          });
    }, []);

    if (!Cookie.getValue("username")) {
        return (<Navigate to="/login" />);
    }


    return (
      <div>
          <Tabs defaultActiveKey="1" items={items}/>
      </div>
    )

}

export default TablePage;
