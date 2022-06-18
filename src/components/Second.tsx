/**
 * 功能：周期-秒
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, message, List, Select } from 'antd';
import { isNumber } from '../utils/index';
import { CronData, CronType } from '../index';

const { Group } = Radio;

interface PropsType {
  second: CronData;
  onChange: Function;
}

export default class Second extends React.Component<PropsType, {}> {
  constructor(props: PropsType) {
    super(props);
    this.formatSecondOptions();
  }

  secondOptions: JSX.Element[] = [];
  formatSecondOptions() {
    this.secondOptions = [];
    for (let x = 0; x < 60; x++) {
      const label = x < 10 ? `0${x}` : x;
      const value = `${x}`;
      const ele = (
        <Select.Option value={value} key={`${label}-${x}`}>
          {label}
        </Select.Option>
      );
      this.secondOptions.push(ele);
    }
  }

  render() {
    const {
      second: { type, start, end, begin, beginEvery, some },
    } = this.props;

    return (
      <div>
        <Group
          value={type}
          onChange={e => {
            const state = { ...this.props.second };
            // if (e.target.value !== "some") {
            //     state.some = ["0"];
            // }
            state.type = e.target.value;
            this.props.onChange(state);
          }}
        >
          <List size="small" bordered>
            <List.Item>
              <Radio value="*">每秒</Radio>
            </List.Item>
            <List.Item style={{ marginBottom: 5 }}>
              <Radio value="period">周期</Radio>
              从 &nbsp;
              <InputNumber
                min={0}
                max={58}
                defaultValue={0}
                style={{ width: 80 }}
                placeholder="秒"
                size="small"
                value={start}
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 0 && Number(value) <= 58) {
                    this.props.second.start = value;
                    if (this.props.second.end - this.props.second.start <= 1) {
                      this.props.second.end = value + 1;
                    }
                    this.props.onChange(this.props.second);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.PERIOD}
              />
              &nbsp;到&nbsp;
              <InputNumber
                min={1}
                max={59}
                defaultValue={1}
                style={{ width: 80 }}
                placeholder="秒"
                value={end}
                size="small"
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 1 && Number(value) <= 59) {
                    this.props.second.end = value;
                    if (this.props.second.end - this.props.second.start <= 1) {
                      this.props.second.start = value - 1;
                    }
                    this.props.onChange(this.props.second);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.PERIOD}
              />
              &nbsp;秒&nbsp;
            </List.Item>
            <List.Item>
              <Radio value="beginInterval"></Radio>
              从第 &nbsp;
              <InputNumber
                min={0}
                max={59}
                defaultValue={0}
                placeholder="秒"
                size="small"
                value={begin}
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 0 && Number(value) <= 59) {
                    this.props.second.begin = Number(value);
                    this.props.onChange(this.props.second);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.BEGIN_INTERVAL}
              />{' '}
              &nbsp;秒开始， 每 &nbsp;
              <InputNumber
                min={0}
                max={59}
                defaultValue={0}
                placeholder="秒"
                size="small"
                value={beginEvery}
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 0 && Number(value) <= 59) {
                    this.props.second.beginEvery = Number(value);
                    this.props.onChange(this.props.second);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.BEGIN_INTERVAL}
              />{' '}
              &nbsp;秒执行一次
            </List.Item>
            <List.Item>
              <Radio value="some">具体秒数（可多选）</Radio>
              <Select
                style={{ width: 'auto' }}
                defaultValue={['1']}
                mode="multiple"
                placeholder="秒数"
                size="small"
                value={some}
                showArrow
                onChange={value => {
                  if (value.length < 1) {
                    return message.warn('至少选择一项');
                  }
                  this.props.second.some = value;
                  this.props.onChange(this.props.second);
                }}
                disabled={type !== 'some'}
              >
                {this.secondOptions}
              </Select>
            </List.Item>
          </List>
        </Group>
      </div>
    );
  }
}
