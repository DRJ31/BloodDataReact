import { Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

export function renderData(data: string | number, range: [number, number]) {
    if (typeof data == "string" && data.length === 0)
        return "";
    if (typeof data == "number" && data < range[0]) {
        return <Statistic
                    value={data}
                    styles={{ content: { color: "#cf1322", fontSize: "14px" } }}
                    suffix={<ArrowDownOutlined />}
                />;
    }
    else if (typeof data == "number" && data > range[1]) {
        return <Statistic
                    value={data}
                    styles={{ content: { color: "#cf1322", fontSize: "14px" } }}
                    suffix={<ArrowUpOutlined />}
                />;
    }
    return data;
}
