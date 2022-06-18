/**
 * 功能：周期-小时
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, RadioChangeEvent, message, List, Select } from 'antd';
import { isNumber } from '../utils/index';
import { CronData, CronType } from '../index';

const { Group } = Radio;

interface PropsType {
  hour: CronData;
  onChange: Function;
}

export default class Hour extends React.Component<PropsType, {}> {
  constructor(props: PropsType) {
    super(props);
    this.formatHourOptions();
  }

  hourOptions: JSX.Element[] = [];
  formatHourOptions() {
    this.hourOptions = [];
    for (let x = 0; x < 24; x++) {
      const label = x < 10 ? `0${x}` : x;
      const value = `${x}`;
      const ele = (
        <Select.Option value={value} key={`${label}-${x}`}>
          {label}
        </Select.Option>
      );
      this.hourOptions.push(ele);
    }
  }

  changeType = (e: RadioChangeEvent) => {
    const state = { ...this.props.hour };
    // if (e.target.value === "some") {
    //     state.some = ["1"];
    // }
    state.type = e.target.value;
    this.props.onChange(state);
  };

  render() {
    const {
      hour: { type, start, end, begin, some, beginEvery },
    } = this.props;
    return (
      <div>
        <Group value={type} onChange={this.changeType}>
          <List size="small" bordered>
            <List.Item>
              <Radio value="*">每小时</Radio>
            </List.Item>
            <List.Item style={{ marginBottom: 5 }}>
              <Radio value="period">周期</Radio>从{' '}
              <InputNumber
                min={0}
                max={22}
                defaultValue={0}
                style={{ width: 80 }}
                placeholder="时"
                size="small"
                value={start}
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 0 && Number(value) <= 22) {
                    this.props.hour.start = value;
                    if (this.props.hour.end - this.props.hour.start <= 1) {
                      this.props.hour.end = value + 1;
                    }
                    this.props.onChange(this.props.hour);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.PERIOD}
              />
              到
              <InputNumber
                min={1}
                max={23}
                defaultValue={1}
                style={{ width: 80 }}
                placeholder="时"
                value={end}
                size="small"
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 1 && Number(value) <= 23) {
                    this.props.hour.end = value;
                    if (this.props.hour.end - this.props.hour.start <= 1) {
                      this.props.hour.start = value - 1;
                    }

                    this.props.onChange(this.props.hour);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.PERIOD}
              />
              &nbsp;小时&nbsp;
            </List.Item>
            <List.Item>
              <Radio value="beginInterval"></Radio>
              从
              <InputNumber
                min={0}
                max={23}
                defaultValue={0}
                placeholder="时"
                size="small"
                value={begin}
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 0 && Number(value) <= 23) {
                    this.props.hour.begin = value;
                    this.props.onChange(this.props.hour);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.BEGIN_INTERVAL}
              />
              时开始， 每
              <InputNumber
                min={1}
                max={23}
                defaultValue={1}
                placeholder="小时"
                size="small"
                value={beginEvery}
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= 1 && Number(value) <= 23) {
                    this.props.hour.beginEvery = value;
                    this.props.onChange(this.props.hour);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.BEGIN_INTERVAL}
              />
              时执行一次
            </List.Item>
            <List.Item>
              <Radio value="some">具体小时数（可多选）</Radio>
              <Select
                style={{ width: 'auto' }}
                defaultValue={['1']}
                mode="multiple"
                placeholder="分钟数"
                size="small"
                value={some}
                showArrow
                onChange={value => {
                  if (value.length < 1) {
                    return message.warn('至少选择一项');
                  }
                  this.props.hour.some = value;
                  this.props.onChange(this.props.hour);
                }}
                disabled={type !== 'some'}
              >
                {this.hourOptions}
              </Select>
            </List.Item>
          </List>
        </Group>
      </div>
    );
  }
}
