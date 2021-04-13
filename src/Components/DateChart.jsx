import { Line } from '@ant-design/charts';
import dayjs from 'dayjs';

export function DateLineChart(props) {
    const { data, k } = props;
    data.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
    data.forEach((v, i) => {
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

export function DateChart(props) {
    const { data, k, min } = props;
    data.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
    data.forEach((v, i) => {
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
        },
        annotations: [
            {
              type: 'regionFilter',
              start: ['min', min],
              end: ['max', '0'],
              color: '#F4664A',
            },
            {
              type: 'text',
              position: ['min', min],
              content: '标准最小值',
              offsetY: -4,
              style: { textBaseline: 'bottom' },
            },
            {
              type: 'line',
              start: ['min', min],
              end: ['max', min],
              style: {
                stroke: '#F4664A',
                lineDash: [2, 2],
              },
            },
        ]
    };

    return <Line {...config} />
}