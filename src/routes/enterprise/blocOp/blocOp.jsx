import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Select, LocaleProvider, DatePicker } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import FilterPage from '@components/filter/index'
import styles from './blocOp.less'
import moment from 'moment'
import { INDEX_BLOC_OP, INDEX_HOTEL_OP } from '@utils/pathIndex'
const { RangePicker } = DatePicker

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return { blocOp:state.blocOp }
}
@connect(mapStateToProps)
export default class Partner extends Component {

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    Object.keys(fields).map((key) => {
      if (key === 'date' && fields[key] &&  fields[key].length > 0) {
        submitData = {
          ...submitData,
          startTime: fields[key][0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: fields[key][1].format('YYYY-MM-DD HH:mm:ss'),
        }
      } else if ((fields[key] || fields[key] === 0) && key !== 'date') {
        submitData = { ...submitData, ...pick(fields, [key]) }
      }
    });
    dispatch({ type: 'blocOp/save', payload: { filter:submitData } });
    dispatch({ type: 'blocOp/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'blocOp/save', payload: { filter:{} } });
  }

  changeStatusOn = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'blocOp/changeStatusOn', payload:{ id,isEnable:1 } })
  }

  changeStatusOff = (id) => {
    const { dispatch } = this.props;
    dispatch({ type:'blocOp/changeStatusOff', payload:{ id,isEnable:0 } })
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.blocOp;
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
        key: 'groupName',
        label: '集团名称',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写集团名称',
          component: Input,
        },
      },
    ];

    /* table列表*/
    const columns = [
      {
        title: '集团名称',
        dataIndex: 'groupName',
        key: 'groupName',
        width:'15%',
      }, {
        title: '联系电话',
        dataIndex: 'groupTel',
        key: 'groupTel',
        width:'15%',
      }, {
        title: '下属酒店数量',
        dataIndex: 'hotelCount',
        key: 'hotelCount',
        width:'20%',
        render:(text, record) => {
          const { id } = record
          return text?<Button onClick={ () => dispatch({type:'blocOp/pushRouter',payload:{ pathname: INDEX_HOTEL_OP, search:{ groupId:id } } }) } type="dashed" size='small'>{ text }</Button>:0
        }
      }, {
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
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '20%',
        render:(record,text) => {
          const { id } = record;
          return (
            <div>
              <Button size='small' type="primary" onClick={() => dispatch({ type:'blocOp/pushRouter',payload:{ pathname:`${INDEX_BLOC_OP}/editBloc`, search:{ id } }})}>编辑</Button>
            </div>
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
        onChange(currentPage, currentSize) {
          dispatch({
            type: 'blocOp/queryBaseData',
            payload: {
              ...filter,
              currentPage,
              currentSize,
            },
          })
        },
        onShowSizeChange(currentPage, currentSize) {
          dispatch({
            type: 'blocOp/queryBaseData',
            payload: {
              ...filter,
              currentPage,
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
          <Button type="primary" onClick={() => dispatch({type:'blocOp/pushRouter',payload:{ pathname:`${INDEX_BLOC_OP}/addBloc`} })}>新增</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
