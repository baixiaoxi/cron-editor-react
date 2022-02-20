/**
 * 功能：周期-天
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, RadioChangeEvent, Select, List, message } from 'antd';
import { isNumber } from 'utils/index';
import { CronData } from 'index';

const { Group } = Radio;

interface PropsType {
    day: CronData,
    onChange: Function,
}

export default class Day extends React.Component<PropsType, {}> {
    constructor(props: PropsType) {
        super(props);
        this.formatDayOptions();
    }

    // formatDayOptions() {
    //     this.dayOptions = [];
    //     for (let x = 1; x < 32; x++) {
    //         this.dayOptions.push({
    //             label: x,
    //             value: `${x}`
    //         });
    //     }
    // }

    dayOptions: JSX.Element[] = [];
    formatDayOptions() {
        this.dayOptions = [];
        for (let x = 1; x < 32; x++) {
            const label = x < 10 ? `0${x}` : x;
            const value = `${x}`;
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            );
            this.dayOptions.push(ele);
        }
    }

    changeType = (e: RadioChangeEvent) => {
        const state = { ...this.props.day };
        // if (e.target.value === "some") {
        //     state.some = ["1"];
        // }
        state.type = e.target.value;
        this.props.onChange(state);
    };

    render() {
        const {
            day: { type, start, end, some, begin, beginEvery, last, closeWorkDay }
        } = this.props;
        return (
            <div>
                <Group value={type} onChange={this.changeType}>
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">每日</Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="?">不指定</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">周期</Radio>从{" "}
                            <InputNumber
                                min={1}
                                max={30}
                                defaultValue={1}
                                style={{ width: 80 }}
                                placeholder="日"
                                size="small"
                                value={start}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1 && Number(value) <= 30) {
                                        this.props.day.start = value;
                                        if (this.props.day.end - this.props.day.start <= 1) {
                                            this.props.day.end = value + 1;
                                        }

                                        this.props.onChange(this.props.day);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== "period"}
                            />{" "}
                            到{" "}
                            <InputNumber
                                min={2}
                                max={31}
                                defaultValue={2}
                                style={{ width: 80 }}
                                placeholder="日"
                                value={end}
                                size="small"
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 2 && Number(value) <= 31) {
                                        this.props.day.end = value;
                                        if (this.props.day.end - this.props.day.start <= 1) {
                                            this.props.day.start = value - 1;
                                        }
                                
                                        this.props.onChange(this.props.day);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== "period"}
                            />
                            &nbsp;日&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            从{" "}
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                placeholder="日"
                                size="small"
                                value={begin}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1) {
                                        this.props.day.begin = value;
                                        this.props.onChange(this.props.day);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== "beginInterval"}
                            />{" "}
                            日开始， 每{" "}
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                placeholder="天"
                                size="small"
                                value={beginEvery}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 0) {
                                        this.props.day.beginEvery = value;
                                        this.props.onChange(this.props.day);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== "beginInterval"}
                            />
                            &nbsp;天执行一次
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="closeWorkDay"></Radio>
                            每月{" "}
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                placeholder="日"
                                size="small"
                                value={closeWorkDay}
                                formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                onChange={(value) => {
                                    if (isNumber(value) && Number(value) >= 1) {
                                        this.props.day.closeWorkDay = value;
                                        this.props.onChange(this.props.day);
                                    } else {
                                        message.info('输入不合法')
                                    }
                                }}
                                disabled={type !== "closeWorkDay"}
                            />
                            &nbsp;日最近的那个工作日
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="last">
                                本月最后{" "}
                                <InputNumber
                                    min={0}
                                    placeholder="天"
                                    size="small"
                                    value={last}
                                    formatter={(value) => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                                    onChange={(value) => {
                                        if (isNumber(value) && Number(value) >= 0) {
                                            this.props.day.last = value;
                                            this.props.onChange(this.props.day);
                                        } else {
                                            message.info('输入不合法')
                                        }
                                    }}
                                    disabled
                                // disabled={type !== "last"}
                                />{" "}
                                天
                            </Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="some">具体天数（可多选）</Radio>
                            <Select
                                style={{ width: "auto" }}
                                defaultValue={["00"]}
                                mode="multiple"
                                placeholder="天数"
                                size="small"
                                value={some}
                                showArrow
                                onChange={value => {
                                    if (value.length < 1) {
                                        return message.warn("至少选择一项");
                                    }
                                    this.props.day.some = value;
                                    this.props.onChange(this.props.day);
                                }}
                                disabled={type !== "some"}
                            >
                                {this.dayOptions}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
