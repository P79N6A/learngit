import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, DatePicker, Select, LocaleProvider, Icon, Tooltip, Popconfirm } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import ConfirmButton from '@components/confirmButton/confirmButton'
import FilterPage from '@components/filter/index'
import styles from './hotel.less'
import { INDEX_HOTEL_OP } from '@utils/pathIndex'
import moment from 'moment'
import { isNumber } from '@utils/valid'

const { RangePicker } = DatePicker;
const Option = Select.Option;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function mapStateToProps(state) {
  return {hotel:state.hotel}
}
@connect(mapStateToProps)
export default class Hotel extends Component {

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
    dispatch({ type: 'hotel/save', payload: { filter:submitData } });
    dispatch({ type: 'hotel/queryBaseData', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'day/save', payload: { filter:{} } });
  }

  getOptionStar = () => {
    const { hotelStars } = this.props.hotel;
    if(hotelStars) {
      const hotelStars_ = [].concat([{ code:'', description:'全部' }],hotelStars)
      return hotelStars_.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
    } else {
      return []
    }
  }

  getOptionStatus = () => {
    const { hotelStatus } = this.props.hotel;
    if(hotelStatus) {
      const hotelStatus_ =  [].concat([{ code:'', description:'全部' }],hotelStatus)
      return hotelStatus_.map((v,n)=> <Option key={n} value={ v.code }>{ v.description }</Option>)
    } else {
      return []
    }
  }
  getOptionGroup = () => {
    const { blocNames } = this.props.hotel;
    if(blocNames) {
      const blocNames_ =  [].concat([ { groupId:'', groupName:'全部'} ],blocNames)
      return blocNames_.map((v,n)=> <Option key={ n } value={ v.groupId }>{ v.groupName }</Option>)
    } else {
      return []
    }
  }

  getStarDom = (num) => {
    if(!num) return '暂无'
    const domArr = [];
    for (let i = 0; i < num; i++) {
      domArr.push(<Icon key={i} type="star" />)
    }
    return domArr
  }

  getStatus = (key) => {
    const { hotelStatus } = this.props.hotel;
    let returnStr = '暂无'
    if(hotelStatus) {
      hotelStatus.map(v=> {
        if(v.code == key) returnStr = v.description
      })
    }
    return returnStr
  }
  addBind = (fhHid) => {
    const { dispatch } = this.props;
    dispatch({type:'hotel/addBind',payload:{ fhHid }})
  }

  render() {
    const { loading, filter, pagination, teamList } = this.props.hotel;
    const { dispatch } = this.props;
    const toolTipDom = (text) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>详情<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
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
        key: 'hotelName',
        label: '酒店名称',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写酒店名称',
          component: Input,
        },
      }, 
      {
        key: 'fgHid',
        label: '飞猪酒店ID',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写飞猪酒店ID',
          component: Input,
        },
      }, 
      {
        key: 'hotelStar',
        label: '酒店星级',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getOptionStar(),
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'hotelStatus',
        label: '运行状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getOptionStatus(),
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'groupId',
        label: '集团名称',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: this.getOptionGroup(),
        fieldAdapter: {
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
        width:'10%',
        render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      },
      {
        title: '飞猪酒店ID',
        dataIndex: 'fgHid',
        key: 'hid',
        width:'10%',
      },
      {
        title: '集团名称',
        dataIndex: 'groupName',
        key: 'groupName',
        width:'10%',
        render:text => {
          return text || '暂无'
        }
      },
      {
        title: '商家支付宝ID',
        dataIndex: 'alipayId',
        key: 'alipayId',
        width:'8%',
      },
      {
        title: '商家支付宝账号',
        dataIndex: 'alipayAccount',
        key: 'alipayAccount',
        width:'8%',
      },
      {
        title: '授权TOKEN',
        dataIndex: 'alipayIsvToken',
        key: 'alipayIsvToken',
        width:'10%',
        render: text => {
          return toolTipDom(text)
        }
      },
      {
        title: '酒店名称',
        dataIndex: 'hotelName',
        key: 'hotelName',
        width:'13%',
      }, {
        title: '酒店地址',
        dataIndex: 'hotelAddress',
        key: 'hotelAddress',
        width:'5%',
        render: text => {
          return toolTipDom(text)
        }
      }, {
        title: '酒店星级',
        dataIndex: 'hotelStar',
        key: 'hotelStar',
        width:'9%',
        render:text => <div>{ this.getStarDom(text) }</div>
      }, {
        title: '酒店状态',
        dataIndex: 'hotelStatus',
        key: 'hotelStatus',
        width:'5%',
        render:text => {
          return this.getStatus(text)
        }
      }, {
        title: '操作',
        dataIndex: '',
        key:'x',
        width: '13%',
        render:(record) => {
          const { fhHid, testFlag } = record;
          return (
            <div className={styles.options}>
            <ConfirmButton isTestFlag={ testFlag } needPop={ false } onClick={() => dispatch({ type:'hotel/pushRouter',payload:{ pathname:`${INDEX_HOTEL_OP}/editHotel`, search:{ fhHid} }})} content='编辑' type='primary' />
            <ConfirmButton isTestFlag={ testFlag } needPop={ true } onClick={this.addBind.bind(this,fhHid)} content='新增设备' type='primary' />
            </div>
          )
        }
      }
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset:this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      rowKey:'fhHid',
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(cur, currentSize) {
          dispatch({
            type: 'hotel/queryBaseData',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'hotel/queryBaseData',
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
          <Button type="primary" onClick={() => dispatch({type:'hotel/pushRouter',payload:{ pathname:`${INDEX_HOTEL_OP}/addHotel`} })}>新增酒店</Button>
        </div>
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
