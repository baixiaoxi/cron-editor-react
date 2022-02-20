/**
 * 功能：主界面
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from 'react';
import classNames from 'classnames';
import { Tabs, Row, Col, Input, List, Collapse } from 'antd';
import Year from './components/Year';
import Month from './components/Month';
import Week from './components/Week';
import Day from './components/Day';
import Hour from './components/Hour';
import Minute from './components/Minute';
import Second from './components/Second';
import CronParse from './utils/parse-lib';
import CronParser from 'cron-parser';
import moment from 'moment';
import './css/index.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;
const dateMinute = 'YYYY-MM-DD HH:mm';

interface PropsType {
    onChange?: Function,
    showRunTime: boolean,// 显示最近5次运行时间
    value: string,
    tabType: string,
    showCronTab: boolean,// 显示cron编辑器
}

export enum CronType {
    NONE = '',// ''
    ASTERISK = '*', // *
    QUESTION = '?', // ?
    PERIOD = '.',
    LAST = 'last',
    BEGIN_INTERVAL = 'interval',
    SOME = 'some',
    CLOSE_WORK_DAY = 'close',
}

export interface CronData{
    start: number,
    end: number,
    last?: number,
    closeWorkDay?: number,
    begin?: number,
    beginEvery?: number,
    type: CronType,
    some?: string[],
    value: string,
}

export interface StateType {
    activeKey: string,
    second: CronData,
    minute: CronData,
    hour: CronData,
    day: CronData,
    month: CronData,
    week: CronData,
    year: CronData,
    runTime: string[],
}

export default class Cron extends React.Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        const date = new Date();
        this.state = {
            activeKey: 'second',
            year: {
                type: CronType.NONE,
                start: date.getFullYear(),
                end: (date.getFullYear() + 1),
                value: '',
            },
            month: {
                start: 1,
                end: 2,
                begin: 1,
                beginEvery: 1,
                type: CronType.ASTERISK,
                some: ['1'],
                value: '',
            },
            week: {
                start: 1,
                end: 2,
                last: 1,
                begin: 1,
                beginEvery: 1,
                type: CronType.QUESTION,
                some: ['1'],
                value: '',
            },
            day: {
                last: 1,
                closeWorkDay: 1,
                start: 1,
                end: 2,
                begin: 1,
                beginEvery: 1,
                type: CronType.ASTERISK,
                some: ['1'],
                value: '',
            },
            hour: {
                start: 0,
                end: 1,
                begin: 0,
                beginEvery: 1,
                type: CronType.ASTERISK,
                some: ['0'],
                value: '',
            },
            minute: {
                start: 0,
                end: 1,
                begin: 0,
                beginEvery: 1,
                type: CronType.ASTERISK,
                some: ['0'],
                value: '',
            },
            second: {
                start: 0,
                end: 1,
                begin: 0,
                beginEvery: 1,
                type: CronType.ASTERISK,
                some: ['0'],
                value: '',
            },
            runTime: [],
        }
    }

    convertToCronType(source: string | undefined, defaultType: CronType = CronType.NONE): CronType {
        if(source == undefined) {
            return defaultType;
        }

        const cronType = source as keyof typeof CronType;
        return CronType[cronType];
    }

    initValue() {
        let { value } = this.props
        value = value.toUpperCase()
        const valuesArray = value.split(' ')
        let newState = { ...this.state }
        newState.second.value = valuesArray[0] || CronType.NONE;
        newState.minute.value = valuesArray[1] || CronType.NONE;
        newState.hour.value = valuesArray[2] || CronType.NONE;
        newState.day.value = valuesArray[3] || CronType.NONE;
        newState.month.value = valuesArray[4] || CronType.NONE;
        newState.week.value = valuesArray[5] || CronType.NONE;
        newState.year.value = valuesArray[6] || CronType.NONE;

        this.setState(newState, () => {
            this.parse()
        })
    }

    componentDidMount() {
        this.initValue()
    }

    componentDidUpdate() {
        const { value } = this.props
        if (this.props.value !== value && value) {
            this.initValue()
        }
    }

    parse() {
        let { year, month, week, day, hour, minute, second } = this.state
        if (year.value.indexOf('-') > -1) {
            year.type = CronType.PERIOD;
            year.start = Number(year.value.split('-')[0]);
            year.end = Number(year.value.split('-')[1]);
        } else {
            year.type = this.convertToCronType(year.value);
        }
        if (week.value.indexOf('-') > -1) {
            week.type = CronType.PERIOD;
            week.start = Number(week.value.split('-')[0]);
            week.end = Number(week.value.split('-')[1]);
        } else if (week.value.indexOf('L') > -1) {
            week.type = CronType.LAST;
            week.last = Number(week.value.split('L')[0] || 1);
        } else if (week.value.indexOf('#') > -1) {
            week.type = CronType.BEGIN_INTERVAL;
            week.begin = Number(week.value.split('#')[1]);
            week.beginEvery = Number(week.value.split('#')[0]);
        } else if (week.value.indexOf(',') > -1 || /^[0-9]+$/.test(week.value)) {
            week.type = CronType.SOME;
            week.some = week.value.split(',')
        } else {
            week.type = this.convertToCronType(week.value, CronType.QUESTION);
        }

        if (month.value.indexOf('-') > -1) {
            month.type = CronType.PERIOD;
            month.start = Number(month.value.split('-')[0]);
            month.end = Number(month.value.split('-')[1]);
        } else if (month.value.indexOf('/') > -1) {
            month.type = CronType.BEGIN_INTERVAL;
            month.begin = Number(month.value.split('/')[0]);
            month.beginEvery = Number(month.value.split('/')[1]);
        } else if (month.value.indexOf(',') > -1 || /^[0-9]+$/.test(month.value)) {
            month.type = CronType.SOME;
            month.some = month.value.split(',')
        } else {
            month.type = this.convertToCronType(month.value, CronType.QUESTION);
        }

        if (day.value.indexOf('-') > -1) {
            day.type = CronType.PERIOD;
            day.start = Number(day.value.split('-')[0]);
            day.end = Number(day.value.split('-')[1]);
        } else if (day.value.indexOf('W') > -1) {
            day.type = CronType.CLOSE_WORK_DAY;
            day.closeWorkDay = Number(day.value.split('W')[0] || 1);
        } else if (day.value.indexOf('L') > -1) {
            day.type = CronType.LAST;
            day.last = Number(day.value.split('L')[0] || 1);
        } else if (day.value.indexOf('/') > -1) {
            day.type = CronType.BEGIN_INTERVAL;
            day.begin = Number(day.value.split('/')[0]);
            day.beginEvery = Number(day.value.split('/')[1]);
        } else if (day.value.indexOf(',') > -1 || /^[0-9]+$/.test(day.value)) {
            day.type = CronType.SOME;
            day.some = day.value.split(',')
        } else {
            day.type = this.convertToCronType(day.value, CronType.QUESTION);
        }

        if (hour.value.indexOf('-') > -1) {
            hour.type = CronType.PERIOD;
            hour.start = Number(hour.value.split('-')[0]);
            hour.end = Number(hour.value.split('-')[1]);
        } else if (hour.value.indexOf('/') > -1) {
            hour.type = CronType.BEGIN_INTERVAL;
            hour.begin = Number(hour.value.split('/')[0]);
            hour.beginEvery = Number(hour.value.split('/')[1]);
        } else if (hour.value.indexOf(',') > -1 || /^[0-9]+$/.test(hour.value)) {
            hour.type = CronType.SOME;
            hour.some = hour.value.split(',')
        } else {
            hour.type = this.convertToCronType(hour.value, CronType.QUESTION);
        }

        if (minute.value.indexOf('-') > -1) {
            minute.type = CronType.PERIOD;
            minute.start = Number(minute.value.split('-')[0]);
            minute.end = Number(minute.value.split('-')[1]);
        } else if (minute.value.indexOf('/') > -1) {
            minute.type = CronType.BEGIN_INTERVAL;
            minute.begin = Number(minute.value.split('/')[0]);
            minute.beginEvery = Number(minute.value.split('/')[1]);
        } else if (minute.value.indexOf(',') > -1 || /^[0-9]+$/.test(minute.value)) {
            minute.type = CronType.SOME;
            minute.some = minute.value.split(',')
        } else {
            minute.type = this.convertToCronType(minute.value, CronType.QUESTION);
        }

        if (second.value.indexOf('-') > -1) {
            second.type = CronType.PERIOD;
            second.start = Number(second.value.split('-')[0]);
            second.end = Number(second.value.split('-')[1]);
        } else if (second.value.indexOf('/') > -1) {
            second.type = CronType.BEGIN_INTERVAL;
            second.begin = Number(second.value.split('/')[0]);
            second.beginEvery = Number(second.value.split('/')[1]);
        } else if (second.value.indexOf(',') > -1 || /^[0-9]+$/.test(second.value)) {
            second.type = CronType.SOME;
            second.some = second.value.split(',')
        } else {
            second.type = this.convertToCronType(second.value, CronType.QUESTION);
        }

        this.setState({
            year: { ...year },
            month: { ...month },
            week: { ...week },
            day: { ...day },
            hour: { ...hour },
            minute: { ...minute },
            second: { ...second },
        })
        console.log('this.state :', this.state)
    }

    format() {
        const { year, month, week, day, hour, minute, second } = this.state
        return `${second.value} ${minute.value} ${hour.value} ${day.value} ${month.value} ${week.value} ${year.value}`
    }

    // 修改状态
    changeState(state: any) {
        this.setState(state, () => {
            this.culcCron()
        })
    }

    // 计算用户的cron
    culcCron() {
        const { n2s } = this
        let { year, month, week, day, hour, minute, second } = this.state
        if (year.type === CronType.PERIOD) {
            year.value = `${n2s(year.start)}-${n2s(year.end)}`
        } else {
            year.value = year.type
        }
        if (month.type === CronType.PERIOD) {
            month.value = `${n2s(month.start)}-${n2s(month.end)}`
        } else if (month.type === CronType.BEGIN_INTERVAL) {
            month.value = `${n2s(month.begin)}/${n2s(month.beginEvery)}`
        } else if (month.type === CronType.SOME) {
            month.value = month.some?.join(',') ?? ''
        } else {
            month.value = month.type
        }
        if (week.type === CronType.PERIOD) {
            week.value = `${n2s(week.start)}-${n2s(week.end)}`
        } else if (week.type === CronType.BEGIN_INTERVAL) {
            week.value = `${n2s(week.beginEvery)}#${n2s(week.begin)}`
        } else if (week.type === CronType.LAST) {
            week.value = n2s(week.last) + 'L'
        } else if (week.type === CronType.SOME) {
            week.value = week.some?.join(',') ?? ''
        } else {
            week.value = week.type
        }
        if (day.type === CronType.PERIOD) {
            day.value = `${n2s(day.start)}-${n2s(day.end)}`
        } else if (day.type === CronType.BEGIN_INTERVAL) {
            day.value = `${n2s(day.begin)}/${n2s(day.beginEvery)}`
        } else if (day.type === CronType.CLOSE_WORK_DAY) {
            day.value = n2s(day.closeWorkDay || 1) + 'W'
        } else if (day.type === CronType.LAST) {
            // day.value = n2s(day.last || 1) + "L";
            day.value = 'L'
        } else if (day.type === CronType.SOME) {
            day.value = day.some?.join(',') ?? '';
        } else {
            day.value = day.type
        }
        if (hour.type === CronType.PERIOD) {
            hour.value = `${n2s(hour.start)}-${n2s(hour.end)}`
        } else if (hour.type === CronType.BEGIN_INTERVAL) {
            hour.value = `${n2s(hour.begin)}/${n2s(hour.beginEvery)}`
        } else if (hour.type === CronType.SOME) {
            hour.value = hour.some?.join(',') ?? '';
        } else {
            hour.value = hour.type
        }
        if (minute.type === CronType.PERIOD) {
            minute.value = `${n2s(minute.start)}-${n2s(minute.end)}`
        } else if (minute.type === CronType.BEGIN_INTERVAL) {
            minute.value = `${n2s(minute.begin)}/${n2s(minute.beginEvery)}`
        } else if (minute.type === CronType.SOME) {
            minute.value = minute.some?.join(',') ?? '';
        } else {
            minute.value = minute.type
        }
        if (second.type === CronType.PERIOD) {
            second.value = `${n2s(second.start)}-${n2s(second.end)}`
        } else if (second.type === CronType.BEGIN_INTERVAL) {
            second.value = `${n2s(second.begin)}/${n2s(second.beginEvery)}`
        } else if (second.type === CronType.SOME) {
            second.value = second.some?.join(',') ?? '';
        } else {
            second.value = second.type
        }
        this.setState(
            {
                year: { ...year },
                month: { ...month },
                week: { ...week },
                day: { ...day },
                hour: { ...hour },
                minute: { ...minute },
                second: { ...second },
            },
            () => {
                this.triggerChange()
            }
        )
    }

    n2s(number: any) {
        if (typeof number === 'number' && number !== NaN) {
            return `${number}`
        }
        return number
    }

    triggerChange() {
        const { onChange, showRunTime } = this.props
        const crontab = this.format()
        console.log('crontab', crontab)
        onChange && onChange(crontab)
        if (!showRunTime) return // 既然不需要，那就不算了
        let tempArr = []
        const weekCron = crontab.split(' ')[5]
        try {
            if (weekCron !== '?') {
                const interval = CronParser.parseExpression(String(crontab).trim())
                for (let i = 0; i < 5; i++) {
                    const temp = moment(interval.next().toString()).format(dateMinute)
                    tempArr.push(temp)
                }
            } else {
                const cron = new CronParse()
                tempArr = cron.expressionChange(String(crontab).trim())
            }
        } catch (error) {
            // console.log("error :", error);
            tempArr.push('暂无最新执行周期')
        }
        if (tempArr.length > 0) {
            this.setState({
                runTime: tempArr,
            })
        }
    }

    // 发生表单值改变，重新计算
    onChange = (type: (keyof StateType), value: string) => {
        (this.state[type] as CronData).value = value;

        this.setState({ ...this.state }, () => {
            this.parse()
        })
    }

    renderOverLay() {
        const { activeKey, week, day } = this.state
        const { tabType } = this.props
        return (
            <Tabs
                activeKey={activeKey}
                onChange={(key) => {
                    this.setState({ activeKey: key })
                }}
            >
                <TabPane tab="秒" key="second">
                    <Second
                        {...this.state}
                        onChange={(state: string) => {
                            this.changeState({ second: state })
                        }}
                    />
                </TabPane>
                <TabPane tab="分钟" key="minute">
                    <Minute
                        {...this.state}
                        onChange={(state: string) => {
                            this.changeState({ minute: state })
                        }}
                    />
                </TabPane>
                <TabPane tab="小时" key="hour">
                    <Hour
                        {...this.state}
                        onChange={(state: string) => {
                            this.changeState({ hour: state })
                        }}
                    />
                </TabPane>
                <TabPane tab="日" key="day">
                    <Day
                        {...this.state}
                        onChange={(state: CronData) => {
                            if (week.type === CronType.QUESTION && state.type === CronType.QUESTION) {
                                const obj = { ...week, type: CronType.ASTERISK }
                                console.log('obj', obj)
                                this.setState({
                                    week: obj,
                                })
                            } else {
                                const obj = { ...week, type: CronType.QUESTION }
                                console.log('obj', obj)
                                this.setState({
                                    week: obj,
                                })
                            }
                            this.changeState({ day: state })
                        }}
                    />
                </TabPane>
                <TabPane tab="周" key="week">
                    <Week
                        {...this.state}
                        onChange={(state: CronData) => {
                            if (day.type === CronType.QUESTION && state.type === CronType.QUESTION) {
                                const obj = { ...week, type: CronType.ASTERISK }
                                console.log('obj', obj)
                                this.setState({
                                    day: obj,
                                })
                            } else {
                                const obj = { ...week, type: CronType.QUESTION }
                                console.log('obj', obj)
                                this.setState({
                                    day: obj,
                                })
                            }

                            this.changeState({ week: state })
                        }}
                    />
                </TabPane>
                <TabPane tab="月" key="month">
                    <Month
                        {...this.state}
                        onChange={(state: string) => {
                            this.changeState({ month: state })
                        }}
                    />
                </TabPane>

                <TabPane tab="年" key="year">
                    <Year
                        {...this.state}
                        onChange={(state: string) => {
                            this.changeState({ year: state })
                        }}
                    />
                </TabPane>
            </Tabs>
        )
    }

    render() {
        const { year, month, week, day, hour, minute, second, runTime, activeKey } = this.state
        const { showRunTime, showCronTab } = this.props

        return (
            <div className="cron-editor-mlamp-react">
                {this.renderOverLay()}
                {showCronTab && (
                    <List bordered style={{ marginTop: 10 }}>
                        <List.Item className="cron-list-type">
                            <Row gutter={5} style={{ width: '100%', textAlign: 'center' }}>
                                <Col span={3}>秒</Col>
                                <Col span={3}>分</Col>
                                <Col span={3}>小时</Col>
                                <Col span={3}>天</Col>
                                <Col span={3}>月</Col>
                                <Col span={3}>星期</Col>
                                <Col span={3}>年</Col>
                            </Row>
                        </List.Item>
                        <List.Item>
                            <Row gutter={5} style={{ width: '100%', textAlign: 'center' }}>
                                <Col span={3}>
                                    <Input
                                        className={classNames({ highlight: activeKey === 'second' })}
                                        value={second.value}
                                        onChange={(e) => {
                                            this.onChange('second', e.target.value)
                                        }}
                                        disabled
                                    />
                                </Col>
                                <Col span={3}>
                                    <Input
                                        value={minute.value}
                                        onChange={(e) => {
                                            this.onChange('minute', e.target.value)
                                        }}
                                        className={classNames({ highlight: activeKey === 'minute' })}
                                        disabled
                                    />
                                </Col>
                                <Col span={3}>
                                    <Input
                                        className={classNames({ highlight: activeKey === 'hour' })}
                                        value={hour.value}
                                        onChange={(e) => {
                                            this.onChange('hour', e.target.value)
                                        }}
                                        disabled
                                    />
                                </Col>
                                <Col span={3}>
                                    <Input
                                        className={classNames({ highlight: activeKey === 'day' })}
                                        value={day.value}
                                        onChange={(e) => {
                                            this.onChange('day', e.target.value)
                                        }}
                                        disabled
                                    />
                                </Col>
                                <Col span={3}>
                                    <Input
                                        className={classNames({ highlight: activeKey === 'month' })}
                                        value={month.value}
                                        onChange={(e) => {
                                            this.onChange('month', e.target.value)
                                        }}
                                        disabled
                                    />
                                </Col>
                                <Col span={3}>
                                    <Input
                                        className={classNames({ highlight: activeKey === 'week' })}
                                        value={week.value}
                                        onChange={(e) => {
                                            this.onChange('week', e.target.value)
                                        }}
                                        disabled
                                    />
                                </Col>
                                <Col span={3}>
                                    <Input
                                        className={classNames({ highlight: activeKey === 'year' })}
                                        value={year.value}
                                        onChange={(e) => {
                                            this.onChange('year', e.target.value)
                                        }}
                                        disabled
                                    />
                                </Col>
                            </Row>
                        </List.Item>
                    </List>
                )}
                {showRunTime && (
                    <Collapse>
                        <Panel header="近5次执行时间" key="1">
                            <List
                                bordered
                                dataSource={runTime}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        第{index + 1}执行时间： {item}
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    </Collapse>
                )}
            </div>
        )
    }
}
