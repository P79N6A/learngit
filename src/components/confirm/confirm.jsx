import React, { Component } from 'react';
import { Form, Button } from 'antd';
import styles from './confirm.less';

const FormItem = Form.Item;

class Confirm extends Component {
  render() {
    const { formItemLayout, doCancle, disabled, confirmName, cancelName } = this.props;
    return (
        <FormItem colon={false} {...formItemLayout} label=" ">
            <div className={styles.btnBox}>
                <Button type="primary" disabled={ disabled } htmlType="submit">
                    { confirmName?confirmName:'确定' }
                </Button>
                <Button onClick={ doCancle }>
                    { cancelName?cancelName:'取消' }
                </Button>
            </div>
        </FormItem> 
    )
  }
}

export default Confirm
