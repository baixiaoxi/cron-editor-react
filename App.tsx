/**
 * 功能：主界面
 * 作者：宋鑫鑫
 * 日期：2019.11.04
 */
import React from "react";
import Cron from './src/index';
import { Button, message } from 'antd';
import Popconfirm from './src/components/ToolTips';
import './src/components/ToolTips/style';

interface StateType {
    visible: boolean;
    crontab: string;
}

class Test extends React.Component<{}, StateType> {
    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            crontab: '0 0 0 * * ?'
        };

    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCronChange = (cronExpression: string) => {
        this.setState({
            crontab: cronExpression
        })
        console.log(cronExpression) //0 0 0 * * ?
    }

    //{/*onOk={this.handleOk}
//    onCancel={this.handleCancel}*}


    render() {
        const { crontab } = this.state
        const cronEditor = (<Cron
            showRunTime
            tabType="card"
            showCronTab
            value={crontab}
            onChange={this.handleCronChange}
        />);

        return (
            <div>
                <Popconfirm
                    visible={this.state.visible}
                    placement='bottomRight'
                    mainContent={cronEditor}
                    onVisibleChange={(e) => {
                        message.info('Clicked on Yes.');
                        this.state.visible && this.setState({visible: false});
                    }}
                >
                    <Button type="primary" onClick={this.showModal}>
                        Open Modal
                    </Button>
                </Popconfirm>
            </div>
        );
    }
}

export default Test;
