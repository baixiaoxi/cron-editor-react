/**
 * 功能：周期-月
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, RadioChangeEvent, List, message, Select } from 'antd';
import { isNumber } from '../utils/index';
import { CronData, CronType } from '../index';

const { Group } = Radio;

interface PropsType {
    month: CronData,
    onChange: Function,
}

export default class Month extends React.Component<PropsType, {}> {
    constructor(props: PropsType) {
        super(props)
        this.formatMonthOptions()
    }

    monthOptions: JSX.Element[] = [];

    formatMonthOptions() {
        this.monthOptions = []
        for (let x = 1; x < 13; x++) {
            const label = `${x}月`
            const value = `${x}`
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            )
            this.monthOptions.push(ele)
        }
    }

    changeType = (e: RadioChangeEvent) => {
        const state = { ...this.props.month }
        state.type = e.target.value
        this.props.onChange(state)
    }

    render() {
        const {
            month: { type, start, end, beginEvery, begin, some },
        } = this.props
        return (
            <div>
                <Group value={type} onChange={this.changeType}>
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">每月</Radio>
                        </List.Item>
                        {/* <List.Item>
                            <Radio value="?">不指定</Radio>
                        </List.Item> */}
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">周期</Radio>从{' '}
                            <InputNumber
                                min={1}
                                max={11}
                                defaultValue={1}
                                placeholder="月"
                                size="small"
                                value={start}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 11) {
                                        this.props.month.start = value;
                                        if (this.props.month.end - this.props.month.start <= 1) {
                                            this.props.month.end = value + 1
                                        }
                                        this.props.onChange(this.props.month);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== CronType.PERIOD}
                            />{' '}
                            到{' '}
                            <InputNumber
                                min={2}
                                max={12}
                                defaultValue={2}
                                placeholder="月"
                                value={end}
                                size="small"
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 2 && Number(value) <= 12) {
                                        this.props.month.end = value;
                                        if (this.props.month.end - this.props.month.start <= 1) {
                                            this.props.month.start = value - 1;
                                        }
                                        this.props.onChange(this.props.month);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== CronType.PERIOD}
                            />
                            &nbsp;月&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            从
                            <InputNumber
                                min={1}
                                max={12}
                                defaultValue={1}
                                placeholder="天"
                                size="small"
                                value={begin}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 12) {
                                        this.props.month.begin = value;
                                        this.props.onChange(this.props.month);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== CronType.BEGIN_INTERVAL}
                            />{' '}
                            月开始， 每{' '}
                            <InputNumber
                                min={1}
                                max={12}
                                defaultValue={1}
                                placeholder="月"
                                size="small"
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 12) {
                                        this.props.month.beginEvery = value;
                                        this.props.onChange(this.props.month);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== CronType.BEGIN_INTERVAL}
                            />{' '}
                            月执行一次
                        </List.Item>
                        <List.Item>
                            <Radio value="some">具体月数（可多选）</Radio>
                            <Select
                                style={{ width: 'auto' }}
                                defaultValue={ ['1']}
                                mode="multiple"
                                placeholder="月数"
                                size="small"
                                value={some}
                                showArrow
                                onChange={(value) => {
                                    if (value.length < 1) {
                                        return message.warn('至少选择一项')
                                    }
                                    this.props.month.some = value;
                                    this.props.onChange(this.props.month);
                                }}
                                disabled={type !== 'some'}
                            >
                                {this.monthOptions}
                            </Select>
                            {/* <Checkbox.Group
                                value={some}
                                onChange={value => {
                                    this.changeParams("some", value);
                                }}
                                options={this.eachMonthOptions()}
                                disabled={type !== "some"}
                            /> */}
                        </List.Item>
                    </List>
                </Group>
            </div>
        )
    }
}
