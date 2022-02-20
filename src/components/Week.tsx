/**
 * 功能：周期-周
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, Select, List, message } from 'antd';
import { isNumber } from 'utils/index';
import { CronData } from 'index';

const { Group } = Radio;

interface PropsType {
    week: CronData,
    onChange: Function,
}

export default class Week extends React.Component<PropsType, {}> {
    weekOptions = [
        {
            label: '星期日',
            value: '1',
        },
        {
            label: '星期一',
            value: '2',
        },
        {
            label: '星期二',
            value: '3',
        },
        {
            label: '星期三',
            value: '4',
        },
        {
            label: '星期四',
            value: '5',
        },
        {
            label: '星期五',
            value: '6',
        },
        {
            label: '星期六',
            value: '7',
        },
    ]

    getWeekOptions() {
        return this.weekOptions.map((item, index) => {
            return (
                <Select.Option value={item.value} key={`${item.label}-${index}`}>
                    {item.label}
                </Select.Option>
            )
        })
    }

    render() {
        const {
            week: { type, start, end, some, begin, beginEvery, last },
        } = this.props
        return (
            <div>
                <Group
                    value={type}
                    onChange={(e) => {
                        const state = { ...this.props.week }
                        // if (e.target.value === "some") {
                        //     state.some = ["1"];
                        // }
                        state.type = e.target.value
                        this.props.onChange(state)
                    }}
                >
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">每周</Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="?">不指定</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">周期</Radio>从{' '}
                            <Select
                                style={{ width: 80 }}
                                placeholder="周"
                                size="small"
                                value={start}
                                onChange={(value) => {
                                    this.props.week.start = value;
                                    this.props.onChange(this.props.week);
                                }}
                                disabled={type !== 'period'}
                            >
                                {this.getWeekOptions()}
                            </Select>{' '}
                            到{' '}
                            <Select
                                style={{ width: 80 }}
                                placeholder="周"
                                value={end}
                                size="small"
                                onChange={(value) => {
                                    this.props.week.end = value;
                                    this.props.onChange(this.props.week);
                                }}
                                disabled={type !== 'period'}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>第{' '}
                            <InputNumber
                                min={1}
                                max={4}
                                placeholder="周"
                                size="small"
                                value={begin}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 4) {
                                        this.props.week.begin = value;
                                        this.props.onChange(this.props.week);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== 'beginInterval'}
                            />{' '}
                            周的{' '}
                            <Select
                                style={{ width: 80 }}
                                defaultValue={1}
                                placeholder="星期"
                                value={beginEvery}
                                size="small"
                                onChange={(value) => {
                                    this.props.week.beginEvery = value;
                                    this.props.onChange(this.props.week);
                                }}
                                disabled={type !== 'beginInterval'}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="last"></Radio>
                            本月最后一个
                            <Select
                                style={{ width: 80 }}
                                placeholder="星期"
                                size="small"
                                value={last}
                                onChange={(value) => {
                                    this.props.week.last = value;
                                    this.props.onChange(this.props.week);
                                }}
                                disabled={type !== 'last'}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                        <List.Item>
                            <Radio value="some">具体星期数（可多选）</Radio>
                            <Select
                                style={{ width: 'auto' }}
                                mode="multiple"
                                placeholder="星期数"
                                size="small"
                                value={some}
                                showArrow
                                onChange={(value) => {
                                    if (value.length < 1) {
                                        return message.warn('至少选择一项')
                                    }
                                    this.props.week.some = value;
                                    this.props.onChange(this.props.week);
                                }}
                                disabled={type !== 'some'}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        )
    }
}
