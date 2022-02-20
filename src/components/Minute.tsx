/**
 * 功能：周期-分钟
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, RadioChangeEvent, message, List, Select } from 'antd';
import { isNumber } from 'utils/index';
import { CronData } from 'index';

const { Group } = Radio;

interface PropsType {
    minute: CronData,
    onChange: Function,
}

export default class Minute extends React.Component<PropsType, {}> {
    constructor(props: PropsType) {
        super(props)
        this.formatMinuteOptions()
    }

    minuteOptions: JSX.Element[] = [];
    formatMinuteOptions() {
        this.minuteOptions = []
        for (let x = 0; x < 60; x++) {
            const label = x < 10 ? `0${x}` : x
            const value = `${x}`
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            )
            this.minuteOptions.push(ele)
        }
    }

    changeType = (e: RadioChangeEvent) => {
        const state = { ...this.props.minute }
        // if (e.target.value === "some") {
        //     state.some = ["1"];
        // }
        state.type = e.target.value
        this.props.onChange(state)
    }

    render() {
        const {
            minute: { type, start, end, some, begin, beginEvery },
        } = this.props
        return (
            <div>
                <Group value={type} onChange={this.changeType}>
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">每分钟</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">周期</Radio>
                            从&nbsp;
                            <InputNumber
                                min={0}
                                max={58}
                                defaultValue={0}
                                style={{ width: 80 }}
                                placeholder="分"
                                size="small"
                                value={start}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 0 && Number(value) <= 58) {
                                        this.props.minute.start = value;
                                        if (this.props.minute.end - this.props.minute.start <= 1) {
                                            this.props.minute.end = value + 1
                                        }
                                        this.props.onChange(this.props.minute)
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== 'period'}
                            />
                            &nbsp;到&nbsp;
                            <InputNumber
                                min={1}
                                max={59}
                                defaultValue={1}
                                style={{ width: 80 }}
                                placeholder="分"
                                value={end}
                                size="small"
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 59) {
                                        this.props.minute.end = value;
                                        if (this.props.minute.end - this.props.minute.start <= 1) {
                                            this.props.minute.start = value - 1;
                                        }
                                        this.props.onChange(this.props.minute);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== 'period'}
                            />
                            &nbsp;分钟&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            从第&nbsp;
                            <InputNumber
                                min={0}
                                max={59}
                                defaultValue={0}
                                placeholder="分"
                                size="small"
                                value={begin}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 0 && Number(value) <= 59) {
                                        this.props.minute.begin = value;
                                        this.props.onChange(this.props.minute);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== 'beginInterval'}
                            />
                            &nbsp;分开始， 每&nbsp;
                            <InputNumber
                                min={1}
                                max={59}
                                defaultValue={1}
                                placeholder="分"
                                size="small"
                                value={beginEvery}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 59) {
                                        this.props.minute.beginEvery = value;
                                        this.props.onChange(this.props.minute);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== 'beginInterval'}
                            />
                            &nbsp;分执行一次
                        </List.Item>
                        <List.Item>
                            <Radio value="some">具体分钟数（可多选）</Radio>
                            <Select
                                style={{ width: 'auto' }}
                                defaultValue={['1']}
                                mode="multiple"
                                placeholder="分钟数"
                                size="small"
                                value={some}
                                showArrow
                                onChange={(value) => {
                                    if (value.length < 1) {
                                        return message.warn('至少选择一项')
                                    }

                                    this.props.minute.some = value;
                                    this.props.onChange(this.props.minute);
                                }}
                                disabled={type !== 'some'}
                            >
                                {this.minuteOptions}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        )
    }
}
