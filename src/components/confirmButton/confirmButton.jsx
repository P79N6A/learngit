import React, { Component } from 'react';
import { Button,  Popconfirm } from 'antd';
class ConfirmButton extends Component {
  render() {
    const { isTestFlag, needPop,  onClick, content, type } = this.props;
    if(isTestFlag) {//操作敏感数据二次提醒
        return (
            <Popconfirm placement="topRight" title={`（您正在操作重要数据）请确认是否${content}?`} onConfirm={ onClick } okText="确认" cancelText="取消">
                <Button size='small' type={ type || 'primary' }>{ content }</Button>
            </Popconfirm>
        )
    } else if(!isTestFlag && needPop) {//没有操作敏感数据，但是本来需要二次提醒
        return (
            <Popconfirm placement="topRight" title={`请确认是否${content}?`} onConfirm={ onClick } okText="确认" cancelText="取消">
                <Button size='small' type={ type || 'primary' }>{ content }</Button>
            </Popconfirm>
        )
    } else {
        return <Button size='small' onClick={ onClick } type={ type || 'primary' }>{ content }</Button>
    }
  }
}

export default ConfirmButton
