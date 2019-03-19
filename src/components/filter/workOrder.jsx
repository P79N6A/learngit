import React, { Component } from 'react';
import { Form, Row, Col, Button, LocaleProvider } from 'antd';
import FieldAdapter from '@alife/scu-field-adapter'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import styles from './workOrder.less';
import moment from 'moment'

const FormItem = Form.Item;
@Form.create()
class FilterPage extends Component {
  componentDidMount() {
    const { form, filter } = this.props;
    const { setFieldsValue } = form
    //返回当前页搜索设置默认值
    if(filter && setFieldsValue) {
      for (const key in filter) {
        if (key.includes('Start') && filter[key]) {
          const searchTimeKey = key.split('Start')[0]
          setFieldsValue({ [searchTimeKey]: [ moment(filter[`${searchTimeKey}Start`]), moment(filter[`${searchTimeKey}End`]) ] })
        } else if(!key.includes('End')) {
          setFieldsValue({ [key]:filter[key] })
        }
      }
    }
  }

  handelSubmit = () => {
    const { onFilterSubmit, form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) onFilterSubmit(values)
    })
  }

  reset = () => {
    const { form, onReset } = this.props;
    const { resetFields } = form;
    onReset && onReset()
    resetFields()
  }

  render() {
    const { filterItems, form, footer } = this.props;
    const { getFieldDecorator } = form;

    const defaultFooter = [
      <Button key="inquire" type="primary" onClick={() => this.handelSubmit()}>查询</Button>,
      <Button key="restart" style={{ marginLeft: 8 }} onClick={this.reset}>重置 </Button>,
    ];

    return (
      <LocaleProvider locale={zhCN}>
      <Form className={styles.searchForm}>
        <Row>
          {
            filterItems.map(v => (
              <Col key={v.key} span={v.span}>
                <FormItem label={v.label} {...v.formItemLayout} >
                  {getFieldDecorator(v.key, v.fieldOption && {
                    ...v.fieldOption,
                  })(
                      <FieldAdapter {...v.fieldAdapter}>
                        {v.option}
                      </FieldAdapter>
                  )}
                </FormItem>
              </Col>))
          }
        </Row>
        <Row>
          <Col span={24} className={styles.selectWrap}>
            { footer || defaultFooter }
          </Col>
        </Row>
      </Form>
      </LocaleProvider>
    )
  }
}

export default FilterPage
