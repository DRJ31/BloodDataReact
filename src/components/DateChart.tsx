import { Line, LineConfig } from '@ant-design/plots';
import dayjs from 'dayjs';

function findMax(arr: any, key: any, rangeMax: any) {
    let max = rangeMax + 1;
    for (let elem of arr) {
        if (elem[key] > max) max = elem[key] + 1;
    }
    return max;
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

export function DateChart(props: any) {
    const { data, k, range, name } = props;
    data.sort((a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix());
    data.forEach((v: any, i: any) => {
        data[i].date = dayjs(v.date).format('YYYY-MM-DD');
        data[i].abnormal = data[i][k] < range[0] || data[i][k] > range[1];
        data[i].color = data[i].abnormal ? "red" : "#2688ff";
    });

    const config: LineConfig = {
        data,
        xField: 'date',
        yField: k,
        point: {
            size: 5,
            shape: 'diamond',
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
        tooltip: {
            items: [
                { name, field: k, color: "#2688ff" },
                { name: "指标情况", field: "abnormal", color: "cyan", valueFormatter: (d: boolean) => d ? "异常" : "正常" }
            ]
        }
    };

    return <Line {...config} />
}
