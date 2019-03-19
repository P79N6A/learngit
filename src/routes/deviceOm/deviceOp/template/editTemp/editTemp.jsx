import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, Alert, Row, Col, Icon, Button, Select } from 'antd'
import Confirm from '@components/confirm/confirm'
import BeforeInit from '@components/HOC/beforeInit/beforeInit'
import TempOption from '@components/HOC/tempOption/tempOption'
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'
import { _jsonParse } from '@utils/tools'
import styles from './editTemp.less'
const FormItem = Form.Item;
const Option = Select.Option;

function mapStateToProps(state) {
    return {editTemp:state.editTemp}
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
//存放添加行点击删除后的page数组
let temPageInfoObj = [];
let temPageInfoFlag = true;
let uuid = 0;
@connect(mapStateToProps)
@Form.create()
@TempOption
@BeforeInit({ name:'editTemp' })
export default class EditTemp extends Component {
    componentDidMount() {
        temPageInfoObj = [];
        temPageInfoFlag = true;
        uuid = 0;
    }

    contains = (arrays, obj) => {
        var i = arrays.length;
        while (i--) {
            if (arrays[i] === obj) {
                return i;
            }
        }
        return false;
    }

    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        //同时删除临时page数组,防止删除第一条默认列表后初始化又增加了这一条记录
        const indexLoca = this.contains(keys,k)
        temPageInfoObj.splice(indexLoca,1)
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
    
      getAddItem = (name,obj) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const initialArr =  obj.map((v,n) => {
            return n
        })
        getFieldDecorator('keys', { initialValue: initialArr });
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
                            {getFieldDecorator(`addLine_${name}_key[${k}]`,{
                                initialValue:obj[index]?obj[index].key:''
                            })(
                                <Input placeholder='参数'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`addLine_${name}_value[${k}]`,{
                                initialValue:obj[index]?obj[index].value:''
                            })(
                                <Input placeholder='默认值'/>
                            )}
                        </FormItem>
                    
                    </Col>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`addLine_${name}_explain[${k}]`,{
                                initialValue:obj[index]?obj[index].explain:''
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

    getAddDom = (data) => {
        const { modelKeyJson } = data
        //为添加行的参数 临时数组第一次赋值
        if(temPageInfoFlag) {
            temPageInfoObj = modelKeyJson?_jsonParse(modelKeyJson):[{"key":"","value":"","explain":""}];
            temPageInfoFlag = !temPageInfoFlag;
        }
        return (
            <div>
                {this.getAddItem('modelKeyJson',temPageInfoObj)}
                <FormItem {...formItemLayoutWithOutLabel} className={styles.addLine}>
                    <Button type="primary" onClick={() => this.add()}>
                        <Icon type="plus" /> 添加一行
                    </Button>
                </FormItem>
            </div>
        )
    }

    //获取产品列表
    getProductListOption = () => {
        const { productList } = this.props.editTemp;
        if(productList) {
            return productList.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
        } else {
            return []
        }
    }

    render() {
        const { dispatch,editTemp } = this.props;
        const { data,productList } = editTemp;
        const { getFieldDecorator } = this.props.form;
        const remind = (
            <div className={styles.remind}>
                <p>1.注意：配置模板的参数不能为关键字：key/value/eplain!!! 否则会出现不可名状的问题</p>
            </div>
        )
        return (
            <div className={styles.root}>
                <h3>修改模板信息</h3>
                <Divider />
                <Alert message={remind} type="warning" />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    <FormItem className={styles.hidden}>
                        {
                            getFieldDecorator('id',{
                                initialValue:data.id
                            })(
                                <Input type="hidden" />
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="模板名称">
                        {
                            getFieldDecorator('modelName',{
                                rules: [{ required: true ,message: '请填写模板名称'}],
                                initialValue:data.modelName
                            })(
                                <Input placeholder="请填写模板名称"/>
                            )
                        }
                    </FormItem>
                    <FormItem {...formItemLayout} label="合作伙伴产品">
                        {
                            getFieldDecorator('partnerProductId',{
                                rules: [{ required: true ,message: '请填写合作伙伴产品'}],
                                initialValue:data.partnerProductId || productList && productList[0].code
                            })(
                                <Select>
                                    { this.getProductListOption() }
                                </Select>
                            )
                        }
                    </FormItem>
                    {this.getAddDom(data)}
                    <Confirm
                        formItemLayout = { formItemLayout }
                        confirmName = '保存'
                        doCancle = { () => dispatch({type:'editTemp/pushRouter',payload:{ pathname:INDEX_DEVICE_TEM_OP }}) }
                    />
                </Form>
            </div>
        )
    }
}