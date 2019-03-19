import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Select, LocaleProvider, DatePicker } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './partnerOp.less'
import moment from 'moment'
import { INDEX_PARTNER_OP } from '@utils/pathIndex'
const { RangePicker } = DatePicker
const Option = Select.Option;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function mapStateToProps(state) {
  return { partnerOp:state.partnerOp }
}
@connect(mapStateToProps)
export default class Partner extends Component {

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
      } else if((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
    });
    dispatch({ type: 'partnerOp/save', payload: { filter:submitData } });
    dispatch({ type: 'partnerOp/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'partnerOp/save', payload: { filter:{} } });
  }

  getPartsList = () => {
    const { typeStatusList } = this.props.partnerOp;
    if(typeStatusList) {
        const partsListSe =  [].concat([{ code:'', description:'请选择' }],typeStatusList.typeList)
        return partsListSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }
  getStatusList = () => {
    const { typeStatusList } = this.props.partnerOp;
    if(typeStatusList) {
        const statusListSe =  [].concat([{ code:'', description:'请选择' }],typeStatusList.statusList)
        return statusListSe.map((v,n)=> <Option key={ n }  value={ v.code }>{ v.description }</Option>)
    } else {
        return []
    }
  }

  showDes = (text) => {
    const { typeStatusList } = this.props.partnerOp
    let des = text
    if(typeStatusList) {
        const partsListSe =  typeStatusList.typeList
        for (let index = 0; index < partsListSe.length; index++) {
          if(partsListSe[index].code == text) {
            des = partsListSe[index].description
            break
          }
          
        }
    }
    return des
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.partnerOp;
    const { dispatch } = this.props;
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
        key: 'partnerName',
        label: '名称',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写名称',
          component: Input,
        },
      }, {
        key: 'partnerType',
        label: '类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getPartsList(),
        fieldAdapter: {
          component: Select,
          onSelect:this.selectType,
        },
      },{
        key: 'partnerStatus',
        label: '状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getStatusList(),
        fieldAdapter: {
          component: Select,
          onSelect:this.selectType,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width:'15%',
        render: text => {
          return (
              <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, {
        title: '名称',
        dataIndex: 'partnerName',
        key: 'partnerName',
        width:'20%',
      }, {
        title: '联系人',
        dataIndex: 'contactName',
        key: 'contactName',
        width:'15%',
      }, {
        title: '联系人电话',
        dataIndex: 'contactTel',
        key: 'contactTel',
        width:'15%',
      }, {
        title: '类型',
        dataIndex: 'partnerType',
        key: 'partnerType',
        width:'15%',
        render:text => {
          return this.showDes(text)
        }
      }, {
        title: '状态',
        dataIndex: 'partnerStatus',
        key: 'partnerStatus',
        width:'10%',
        render:text => {
          if(text === 1) return <span>合作</span>
          if(text === 0) return <span>停止合作</span>
        }
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '10%',
        render:(record,text) => {
          //1.启用,  2.禁用
          const { id, isEnable } = record;
          return (
            <Button size='small' type="primary" onClick={() => dispatch({ type:'partnerOp/pushRouter',payload:{ pathname:`${INDEX_PARTNER_OP}/editPartner`, search:{ id } }})}>编辑</Button>
          )
        }
      }
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
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
            type: 'partnerOp/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'partnerOp/queryBaseData',
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
          <Button type="primary" onClick={() => dispatch({type:'partnerOp/pushRouter',payload:{ pathname:`${INDEX_PARTNER_OP}/addPartner`} })}>新增</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
