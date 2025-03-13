import { Line, LineConfig } from '@ant-design/plots';
import dayjs from 'dayjs';

function findMax(arr: any, key: string, rangeMax: number) {
    let max = rangeMax + 1;
    for (const elem of arr) {
        if (elem[key] > max) max = elem[key] + 1;
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

export function DateChart(props: any) {
    const { data, k, range, name: titleName } = props;
    data.sort((a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix());
    data.forEach((v: any, i: number) => {
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
                render: (_ev: any, { title, items }: TooltipParam) => {
                    const list = items.filter((item: TooltipItem) => item.name === k)
                    return (
                      <div key={title}>
                          <h4>{title}</h4>
                          {list.map((item: any) => {
                              const { value } = item;
                              console.log(item)
                              return (
                                <div>
                                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                        <span
                          style={{
                              display: 'inline-block',
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: value < range[0] || value > range[1] ? "red" : "#2688ff",
                              marginRight: 6,
                          }}
                        ></span>
                                            <span>{titleName}</span>
                                        </div>
                                        <b>{value}</b>
                                    </div>
                                </div>
                              );
                          })}
                      </div>
                    );
                }
            }
        }
    };

    return <Line {...config} />
}
