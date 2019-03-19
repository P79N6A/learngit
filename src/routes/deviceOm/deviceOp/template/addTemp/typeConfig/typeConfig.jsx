import React,{ Component } from 'react'
import { connect } from 'dva'
import TempOption from '@components/HOC/tempOption/tempOption'
import { Form, Divider, Input, Alert, Row, Col, Icon, Button, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
import styles from './typeConfig.less'
const FormItem = Form.Item;
const { Option } = Select;

function mapStateToProps(state) {
    return {typeConfig:state.typeConfig}
}

const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 8, offset: 4 },
    },
};
let uuid = 0;
@connect(mapStateToProps)
@Form.create()
@TempOption
export default class TypeConfig extends Component {
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }
    
      add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        form.setFieldsValue({
          keys: nextKeys,
        });
      }
    
      getAddItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        uuid =  keys.length>0?keys[keys.length-1]+1:0
        return keys.map((k, index) => {
          return (
            <FormItem
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              label={index === 0 ? '页面配置' : ''}
              key={k}
              className = {styles.addLine}
            >
                  <Row gutter={16} className = {styles.addRow}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`addLine_modelKeyJson_key[${k}]`,{
                                initialValue:''
                            })(
                                <Input placeholder='参数'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`addLine_modelKeyJson_value[${k}]`,{
                                initialValue:''
                            })(
                                <Input placeholder='默认值'/>
                            )}
                        </FormItem>
                    
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`addLine_modelKeyJson_explain[${k}]`,{
                                initialValue:''
                            })(
                                <Input placeholder='参数说明'/>
                            )}
                        </FormItem>
                    </Col>
                    {keys.length > 1 ? (
                        <Button
                            className={styles.deleteBtn}
                            type="primary"
                            size="small"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        >删除</Button>
                    ) : null}
                </Row>
            </FormItem>
          );
        });
    }

    //获取产品列表
    getProductListOption = () => {
        const { productList=[] } = this.props.typeConfig;
        if(productList.length>0) {
            return productList.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    render() {
        const { dispatch,typeConfig } = this.props;
        const { partnerName,partnerType,productList=[] } = typeConfig;
        const { getFieldDecorator } = this.props.form;
          const remind = (
              <div className={styles.remind}>
                  <p>1.注意：配置模板的参数不能为关键字：key/value/eplain!!! 否则会出现不可名状的问题</p>
              </div>
          )
        return (
            <div className={styles.root}>
                <h3>{partnerName}</h3>
                <Divider />
                <Alert message={remind} type="warning" />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    <FormItem {...formItemLayout} className={styles.hidden}>
                        {
                            getFieldDecorator('partnerName',{
                                initialValue:partnerName
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} className={styles.hidden}>
                        {
                            getFieldDecorator('partnerType',{
                                initialValue:partnerType
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="模板名称">
                        {
                            getFieldDecorator('modelName',{
                                rules: [{ required: true ,message: '请填写模板名称'}]
                            })(
                                <Input placeholder="请填写模板名称"/>
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="合作伙伴产品">
                        {
                            getFieldDecorator('partnerProductId',{
                                rules: [{ required: true ,message: '请填写合作伙伴产品'}],
                                initialValue:productList.length>0 && productList[0].code
                            })(
                                <Select>
                                    { this.getProductListOption() }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem className={styles.hidden}>
                        {
                            getFieldDecorator('modelKeyJson',{
                                initialValue:[{key:'',value:'',explain:''}]
                            })(
                                <Input type="hidden" />
                            )
                        }
                    </FormItem>
                    {this.getAddItem()}
                    <FormItem {...formItemLayoutWithOutLabel} className={styles.addLine}>
                        <Button type="primary" onClick={() => this.add()}>
                            <Icon type="plus" /> 添加一行
                        </Button>
                    </FormItem>
                    <Confirm
                        formItemLayout = { formItemLayout }
                        confirmName = '保存'
                        doCancle = { () => dispatch({type:'typeConfig/pushRouter',payload:{ pathname:`${INDEX_DEVICE_TEM_OP}/addTemp` }}) }
                    />
                </Form>   
            </div>
        )
    }
}