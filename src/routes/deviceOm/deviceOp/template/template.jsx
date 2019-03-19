import React, { Component } from 'react';
import { connect } from 'dva';
import { DatePicker, Button, Table, Popconfirm, Select, LocaleProvider, Input } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import { INDEX_DEVICE_OP } from '@utils/pathIndex'
import styles from './template.less'
import moment from 'moment'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {template:state.template}
}
@connect(mapStateToProps)
export default class Template extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    Object.keys(fields).map((key) => {
      if (key === 'date' && fields[key] && fields[key].length > 0) {
        submitData = {
          ...submitData,
          startTime: fields[key][0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: fields[key][1].format('YYYY-MM-DD HH:mm:ss'),
        }
      } else if ((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
    });
    dispatch({ type: 'template/save', payload: { filter:submitData } });
    dispatch({ type: 'template/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'template/save', payload: { filter:{} } });
  }

  goBack = () => {
    const { dispatch } = this.props
    dispatch({type:'template/save',payload:{ filter:{} }})
    dispatch({type:'template/pushRouter',payload:{ pathname:INDEX_DEVICE_OP }})
  }
  
  confirmForbid = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'template/forbid', payload:{ id } })
  }

  confirmAvailable = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'template/available', payload:{ id } })
  }

  //获取配置类型
  getPartsList = () => {
    const { typeLists } = this.props.template;
    if(typeLists && typeLists.typeList) {
        const partsListSe =  [].concat([{ code:'', description:'全部' }],typeLists.typeList)
        return partsListSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.template;
    const { dispatch } = this.props;
    //Device", "CardMaker", "IdReader", "CardIssuer", "PSB", "Verify", "PMS"
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '创建时间',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
        },
      }, 
      {
        key: 'modelName',
        label: '模板名称',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写设备名称',
          component: Input,
        },
      }, 
      {
        key: 'partnerType',
        label: '配置类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getPartsList(),
        fieldAdapter: {
          placeholder: '请选择配置类型',
          component: Select,
        },
      }, {
        key: 'status',
        label: '模板状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="" value="">全部</Option>,
          <Option key="1" value="1">激活</Option>,
          <Option key="2" value="2">禁用</Option>,
        ],
        fieldAdapter: {
          placeholder: '请选择资源类型',
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:'25%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      {
        title: '配置类型',
        dataIndex: 'partnerName',
        key: 'partnerType',
        width:'10%',
      }, 
      {
        title: '模版code',
        dataIndex: 'id',
        key: 'id',
        width:'10%',
      }, 
      {
        title: '模板名称',
        dataIndex: 'modelName',
        key: 'modelName',
        width:'10%',
      }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width:'10%',
        render:text => {
          return (
            text === 1?(
              <span>激活</span>
            ):(
              <span>禁用</span>
            )
          )
        }
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '25%',
        render:(record,text) => {
          //1.激活,  2.禁用
          const { id } = record;
          return (
            record.status != 2?
            (
              <div>
                  <Button size='small' onClick={() => dispatch({ type:'template/pushRouter',payload:{ pathname:`${INDEX_DEVICE_OP}/template/editTemp`,search:{ id } }})}>编辑</Button>
                  <Popconfirm placement="topRight" title="请确认是否禁用?" onConfirm={this.confirmForbid.bind(this,record.id)} okText="确认" cancelText="取消">
                    <Button size='small' type="danger">禁用</Button>
                  </Popconfirm>
              </div>
            ):(
              <Popconfirm placement="topRight" title="请确认是否启用?" onConfirm={this.confirmAvailable.bind(this,record.id)} okText="确认" cancelText="取消">
                <Button size='small' type="primary">启用</Button>
              </Popconfirm>
            )
          )
        }
      }
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset};
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      rowKey:'id',
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(cur, currentSize) {
          dispatch({
            type: 'template/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'template/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
    };

    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'template/pushRouter',payload:{ pathname:`${INDEX_DEVICE_OP}/template/addTemp` }})}>新增模板</Button>
          <Button type="primary" onClick={ this.goBack }>返回</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
