/**
 * 功能：周期-年
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import { Radio, InputNumber, message, Col, List } from 'antd';
import { isNumber } from '../utils/index';
import { CronData, CronType } from '../index';

const { Group } = Radio;

interface PropsType {
  year: CronData;
  onChange: Function;
}

export default class Year extends React.Component<PropsType, {}> {
  render() {
    const {
      year: { type, start, end },
    } = this.props;
    return (
      <div>
        <Group
          value={type}
          onChange={e => {
            this.props.year.type = e.target.value;
            this.props.onChange(this.props.year);
          }}
          defaultValue=""
        >
          <List size="small" bordered>
            <List.Item>
              <Radio value="">不指定</Radio>
            </List.Item>
            <List.Item>
              <Radio value="*">每年</Radio>
            </List.Item>
            <List.Item>
              <Radio value="period">周期</Radio>
              <InputNumber
                min={new Date().getFullYear()}
                value={start}
                placeholder="年"
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= new Date().getFullYear()) {
                    this.props.year.start = value;
                    if (this.props.year.end - this.props.year.start <= 1) {
                      this.props.year.end = value + 1;
                    }
                    this.props.onChange(this.props.year);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.PERIOD}
              />
              {' - '}
              <InputNumber
                min={new Date().getFullYear() + 1}
                value={end}
                placeholder="年"
                formatter={value => value?.toString().replace(/[^\d\.]/g, '') ?? ''}
                onChange={value => {
                  if (isNumber(value) && Number(value) >= new Date().getFullYear() + 1) {
                    this.props.year.end = value;
                    if (this.props.year.end - this.props.year.start <= 1) {
                      this.props.year.start = value - 1;
                    }
                    this.props.onChange(this.props.year);
                  } else {
                    message.info('输入不合法');
                  }
                }}
                disabled={type !== CronType.PERIOD}
              />
            </List.Item>
          </List>
        </Group>
      </div>
    );
  }
}
