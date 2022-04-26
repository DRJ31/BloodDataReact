import {Line, LineConfig} from '@ant-design/charts';
import dayjs from 'dayjs';

function findMax(arr: any, key: any, rangeMax: any) {
  let max = rangeMax + 10;
  for (let elem of arr) {
    if (elem[key] > rangeMax) max = elem[key] + 10;
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
    });

    const config: LineConfig = {
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
        },
        annotations: [
            {
              type: 'regionFilter',
              start: ['min', range[0]],
              end: ['max', '0'],
              color: '#F4664A',
            },
            {
              type: 'text',
              position: ['min', range[0]],
              content: '标准最小值',
              offsetY: -4,
              style: { textBaseline: 'bottom' },
            },
            {
              type: 'line',
              start: ['min', range[0]],
              end: ['max', range[0]],
              style: {
                stroke: '#F4664A',
                lineDash: [2, 2],
              },
            },
            {
              type: 'regionFilter',
              start: ['min', findMax(data, k, range[1])],
              end: ['max', range[1]],
              color: '#F4664A',
            },
            {
              type: 'text',
              position: ['min', range[1] - 1],
              content: '标准最大值',
              offsetY: -4,
              style: { textBaseline: 'bottom' },
            },
            {
              type: 'line',
              start: ['min', range[1]],
              end: ['max', range[1]],
              style: {
                stroke: '#F4664A',
                lineDash: [2, 2],
              },
            },
        ],
        tooltip: {
          formatter: (datum: any) => {
            return { name, value: datum[k] };
          },
        }
    };

    return <Line {...config} />
}