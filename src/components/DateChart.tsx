import { Line, LineConfig } from '@ant-design/plots';
import dayjs from 'dayjs';

interface ChartDataItem {
    date: string;
    [key: string]: number | string;
}

interface DateChartProps {
    data: ChartDataItem[];
    k: string;
    range: [number, number];
    name: string;
}

function findMax(arr: ChartDataItem[], key: string, rangeMax: number) {
    let max = rangeMax + 1;
    for (const elem of arr) {
        if ((elem[key] as number) > max) max = (elem[key] as number) + 1;
    }
    return max;
}

interface TooltipItem {
    name: string;
    value: string | number;
    color: string;
}

interface TooltipParam {
    title: string;
    items: TooltipItem[];
}

// export function DateLineChart(props) {
//     const { data, k, name } = props;
//     data.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
//     data.forEach((v, i) => {
//         data[i].date = dayjs(v.date).format('YYYY-MM-DD');
//     });

//     const config = {
//         data,
//         height: 400,
//         xField: 'date',
//         yField: k,
//         point: {
//           size: 5,
//           shape: 'diamond',
//         },
//         slider: {
//             start: 0.7,
//             end: 1.0,
//         },
//         tooltip: {
//           formatter: (datum) => {
//             return { name, value: datum[k] };
//           },
//         }
//       };

//     return <Line {...config} />
// }

export function DateChart({ data, k, range, name: titleName }: DateChartProps) {
    data.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
    data.forEach((v, i) => {
        data[i].date = dayjs(v.date).format('YYYY-MM-DD');
    });

    const config: LineConfig = {
        data,
        xField: 'date',
        yField: k,
        colorField: k,
        scale: {
            // y: { nice: true },
            color: {
                type: "threshold",
                domain: [range[0], range[1]],
                range: ['red', '#2688ff', 'red']
            }
        },
        axis: {
            x: {
                labelAutoRotate: false,
            }
        },
        slider: {
            x: {
                values: [0.7, 1]
            }
        },
        annotations: [
            {
                type: "text",
                data: [data[Math.floor(data.length * 0.72)].date, range[0]],
                encode: { text: "标准最小值" },
                style: { fill: "red", textAlign: "center", dy: 10 },
            },
            {
                type: 'lineY',
                yField: range[0],
                style: {
                    stroke: '#F4664A',
                    lineDash: [2, 2],
                },
            },
            {
                type: "text",
                data: [data[Math.floor(data.length * 0.72)].date, range[1]],
                encode: { text: "标准最大值" },
                style: { fill: "red", textAlign: "center", dy: -10 },
            },
            {
                type: 'lineY',
                yField: range[1],
                style: {
                    stroke: '#F4664A',
                    lineDash: [2, 2],
                },
            },
            {
                type: "rangeY",
                data: [{ y: [0, range[0]] }],
                yField: 'y',
                style: {
                    fill: "red"
                }
            },
            {
                type: "rangeY",
                data: [{ y: [range[1], findMax(data, k, range[1])] }],
                yField: 'y',
                style: {
                    fill: "red"
                }
            }
        ],
        style: {
            gradient: 'y',
            lineWidth: 1.5,
            lineJoin: 'round',
        },
        interaction: {
            tooltip: {
                render: (_ev: unknown, { title, items }: TooltipParam) => {
                    const list = items.filter((item: TooltipItem) => item.name === k);
                    const rows = list.map((item: TooltipItem) => {
                        const { value } = item;
                        const color = (value as number) < range[0] || (value as number) > range[1] ? 'red' : '#2688ff';
                        return `<div style="margin:0;display:flex;justify-content:space-between;gap:12px">
                            <div>
                                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background-color:${color};margin-right:6px"></span>
                                <span>${titleName}</span>
                            </div>
                            <b>${value}</b>
                        </div>`;
                    }).join('');
                    return `<div><h4 style="margin:0 0 4px">${title}</h4>${rows}</div>`;
                }
            }
        }
    };

    return <Line {...config} />
}
