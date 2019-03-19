import React,{ Component } from 'react'
import { Alert, Form, InputNumber, Row,Input, Col, Icon, Select, Button } from 'antd'
import Confirm from '@components/confirm/confirm'
import styles from './walkin.less'
import { max } from '@utils/valid'
import withRef from '@components/HOC/withRef/withRef'
import BeforeInit from '@components/HOC/beforeInit/beforeInit'
const FormItem = Form.Item;
const { Option } = Select

const formItemLayout = {
    labelCol: {
        xs: { span: 10 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 20 },
        sm: { span: 8 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 8, offset: 4 },
    },
};
//存放添加行点击删除后的roomType数组
let temRoomTypes = [];
let uuid = 0;

@Form.create()
@withRef
@BeforeInit({ name:'editHotel', dataName:'walkinConfig' })
export default class Walkin extends Component {
    componentDidMount() {
        uuid = 0;
    }
    getTrueParams = (v) => {
        for(let key in v) {
            /**
             * 该判断主要将添加行的行数据组合成真正的参数，因为存在删除这一样，导致数组中会存在empty的情况所以下标重新定义
             */
            if(key.includes('addLine')) {
                let addLineArr = key.split('_');
                v[addLineArr[1]] = v[addLineArr[1]]?v[addLineArr[1]]:[];
                let addLineTrueV = v[addLineArr[1]];
                //过滤empty 获取下标书组
                let indexInit = 0;
                v[key].map((vAdd) => {
                    if(!addLineTrueV[indexInit]) {
                        addLineTrueV[indexInit] = {};
                    }
                    addLineTrueV[indexInit][addLineArr[2]] = addLineArr[2]=='value'?vAdd.join(','):vAdd;
                    indexInit++;
                })
            }
        }
    }

    handleSubmit_ = (e) => {
        const { updateWalkin } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                //遍历参数重新组装需要参数
                this.getTrueParams(values);
                values.walkinRoomType = JSON.stringify(values.walkinRoomType)
                updateWalkin(values)
            }
        });
    }
    
    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    walkinChange = (v) => {
        const { save } = this.props
        const { walkinConfig } = this.props.editHotel
        walkinConfig.walkinOnOff = v
        save({ walkinConfig })
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
        //同时删除临时roomType数组,防止删除第一条默认列表后初始化又增加了这一条记录
        const indexLoca = this.contains(keys,k)
        temRoomTypes.splice(indexLoca,1)
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

    getAddItem = (obj) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const initialValue =  obj.map((v,n) => {
            return n
        })
        getFieldDecorator('keys', { initialValue });
        const keys = getFieldValue('keys');
        console.log('obj---',obj)
        console.log('keys---',keys)
        uuid =  keys.length>0?keys[keys.length-1]+1:0
        return keys.map((k, index) => {
          return (
            <FormItem
              {...formItemLayoutWithOutLabel}
              label={''}
              key={k}
              className = {styles.addLine}
            >
                  <Row gutter={16} className = {styles.addRow}>
                    <Col span={8}>
                        <FormItem>
                            {getFieldDecorator(`addLine_walkinRoomType_key[${k}]`,{
                                rules:[{ required:false, message:'请输入名称' }],
                                initialValue:obj[index]?obj[index].key:''
                            })(
                                <Input placeholder='请输入分类名称'/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {getFieldDecorator(`addLine_walkinRoomType_value[${k}]`,{
                                rules:[{ required:false, message:'请选择房型' }],
                                initialValue:(obj[index] && obj[index].value)?obj[index].value:[]
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="请选择房型"
                                >
                                    { this.getRoomeTypes() }
                                </Select>
                            )}
                        </FormItem>
                    
                    </Col>
                    {keys.length > 1 ? (
                        <Col span={4}>
                            <Button
                                className={styles.deleteBtn}
                                type="primary"
                                size="small"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            >删除</Button>
                        </Col>
                    ) : null}
                </Row>
            </FormItem>
          );
        });
    }

    getRoomeTypes = () => {
        const { editHotel={} } = this.props
        const { walkinConfig={} } = editHotel
        const { roomTypeList } = walkinConfig
        if(roomTypeList) {
            return roomTypeList.map((v,n)=> <Option key={n} value={ v.roomTypeCode }>{ v.roomTypeName }</Option>)
        } else {
            return []
        }
    }

    render() {
        const { editHotel={} } = this.props
        const { walkinConfig={} } = editHotel
        const { getFieldDecorator } = this.props.form;
        //为添加行的参数 临时数组第一次赋值
        temRoomTypes = walkinConfig.walkinRoomType || [{"key":"","value":[]}];
        return (
            <div className={styles.root}>
                <Alert style={{ marginBottom:'10px' }} message="*功能前置条件：西软PMS线下" type="warning" />
                <Form onSubmit={this.handleSubmit_} className={styles.form}>
                    <FormItem {...formItemLayout} label='首页walkin入住按钮'>
                        {getFieldDecorator('walkinHomepageShowOnOff', {
                            initialValue:walkinConfig['walkinHomepageShowOnOff'] || '0'
                        })(
                            <Select>
                                <Option value={ '0' }>关闭</Option>
                                <Option value={ '1' }>开启</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label='是否开启walkin功能'>
                        {getFieldDecorator('walkinOnOff', {
                            initialValue:walkinConfig['walkinOnOff'] || '0'
                        })(
                            <Select onChange={ this.walkinChange }>
                                <Option value={ '0' }>关闭</Option>
                                <Option value={ '1' }>开启</Option>
                            </Select>
                        )}
                    </FormItem>
                    {
                        walkinConfig['walkinOnOff'] == '1' && <div>
                            <FormItem {...formItemLayout} label='最大预定天数（天）'>
                                {getFieldDecorator('walkinMaxBookingDays', {
                                    rules:[{ required:true, message:'请输入最大预定天数' }],
                                    initialValue:walkinConfig['walkinMaxBookingDays'] || 1
                                })(
                                    <InputNumber min={1} max={30} />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='来源码'>
                                {getFieldDecorator('walkinSourceCode', {
                                    rules:[{ required:true, message:'请输入来源码' }, { validator:max(10)}],
                                    initialValue:walkinConfig['walkinSourceCode'] || ''
                                })(
                                    <Input placeholder='请输入来源码' />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='市场码'>
                                {getFieldDecorator('walkinMarketCode', {
                                    rules:[{ required:true, message:'请输入市场码' }, { validator:max(10)}],
                                    initialValue:walkinConfig['walkinMarketCode'] || ''
                                })(
                                    <Input placeholder='请输入市场码' />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='预定类型'>
                                {getFieldDecorator('walkinBookType', {
                                    rules:[{ required:true, message:'请输入预定类型' }, { validator:max(10)}],
                                    initialValue:walkinConfig['walkinBookType'] || ''
                                })(
                                    <Input placeholder='请输入预定类型' />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='渠道码'>
                                {getFieldDecorator('walkinChannelCode', {
                                    rules:[{ required:true, message:'请输入渠道码' }, { validator:max(10)}],
                                    initialValue:walkinConfig['walkinChannelCode'] || ''
                                })(
                                    <Input placeholder='请输入渠道码' />
                                )}
                            </FormItem>
                            <FormItem {...formItemLayout} label='房价码'>
                                {getFieldDecorator('walkinRoomPriceCode', {
                                    rules:[{ required:true, message:'请输入房价码' }, { validator:max(10)}],
                                    initialValue:walkinConfig['walkinRoomPriceCode'] || ''
                                })(
                                    <Input placeholder='请输入房价码' />
                                )}
                            </FormItem>
                            <Row style={{ marginTop:'10px', height:'40px' }}>
                                <Col style={{ textAlign:'right' }} span={4}>房型分类：</Col>
                                <Col span={2}>
                                <Button type="primary" onClick={() => this.add()}>
                                    <Icon type="plus" /> 新增
                                </Button>
                                </Col>
                                <Col span={18}>
                                    <span>(字段说明：用于管理同类房型的可用房总数)</span>
                                </Col>
                            </Row>
                            { this.getAddItem(temRoomTypes) }
                        </div>
                    }
                    <Confirm
                        formItemLayout = { formItemLayout }
                        doCancle = { this.doCancle_ }
                    />
                </Form>   
            </div>
        )
    }
}