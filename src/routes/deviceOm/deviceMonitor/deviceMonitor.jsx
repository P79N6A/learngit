import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Input, Table, Tooltip, DatePicker, LocaleProvider, Icon, Select, Popconfirm, Tag } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { pick } from 'lodash'
import { INDEX_DEVICE_MONITOR } from '@utils/pathIndex';
import FilterPage from '@components/filter/index'
import styles from './deviceMonitor.less'
import moment from 'moment'
const { Option } = Select;

// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
let TIME_MONITOR = null
function mapStateToProps(state) {
  return {deviceMonitor:state.deviceMonitor}
}
@connect(mapStateToProps)
export default class Day extends Component {
  componentDidMount() {
    clearInterval(TIME_MONITOR)
    TIME_MONITOR = setInterval(() => {
      this.loopGetMonitor()
    }, 5000);
  }
  componentWillUnmount() {
    clearInterval(TIME_MONITOR)
  }

  loopGetMonitor = () => {
    const { dispatch } = this.props;
    const { filter, currentSize, currentPage } = this.props.deviceMonitor;
    dispatch({ type:'deviceMonitor/getMonitorList', payload:{ currentPage, currentSize, ...filter } })
  }

  onFilterSubmit = (fields) => {
    const { dispatch } = this.props;
    let submitData = {};
    dispatch({ type:'deviceMonitor/save',payload:{ isShowExport:false } })
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
    dispatch({ type: 'deviceMonitor/save', payload: { filter:submitData } });
    dispatch({ type: 'deviceMonitor/getMonitorList', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'people/save', payload: { filter:{} } });
  }

  exportData = () => {
    const { dispatch } = this.props;
    dispatch({ type:'deviceMonitor/exportPeopleList' })
  }

  render() {
    const { loading, filter, pagination,teamList } = this.props.deviceMonitor;
    const { dispatch } = this.props;
    const toolTipDom = (text,content) => (
      <Tooltip title={ text?<div className={styles.toolTip} dangerouslySetInnerHTML = {{ __html:text }}></div>:'没有信息' }>
        <Button type="dashed" size='small'>{ content || '详情' }<Icon type="info-circle" style={{ color: '#66baff' }} /></Button>
      </Tooltip>
    )
    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'deviceId',
        label: '设备Id',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          placeholder: '请填写设备Id',
          component: Input,
        },
      }, 
      {
        key: 'connType',
        label: '连接类型',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="1">uac</Option>,
          <Option key="3" value="2">app</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
      {
        key: 'status',
        label: '设备状态',
        span: 8,
        formItemLayout,
        fieldOption: { initialValue: '' },
        option: [
          <Option key="1" value="">全部</Option>,
          <Option key="2" value="1">在线</Option>,
          <Option key="3" value="0">离线</Option>
        ],
        fieldAdapter: {
          component: Select,
        },
      },
    ];

    /* table列表*/
    const columns = [
      { title:'客户端ID', dataIndex: 'clientId', key: 'clientId', fixed: 'left',
      width: 100,  },
      { title:'酒店名称', dataIndex: 'hotelName', key: 'hotelName', fixed: 'left',
      width: 150, render:text=>{
        return text || '暂无'
      }  },
      { title:'所在城市', dataIndex: 'hotelCity', key: 'hotelCity', fixed: 'left',
      width: 100, render:text=>{
        return text || '暂无'
      }  },
      { title:'连接类型', dataIndex: 'connType', key: 'connType', render: text=>{
        //1 uac 2 app
        return text == 1?'uac':'app'
      }},
      { title:'客户端版本', dataIndex: 'version', key: 'version', render:(text,record)=>{
        const { versionCode } = record
        const versionCodeStr = versionCode?`（${versionCode}）`:''
        return text?`${text}${versionCodeStr}`:'暂无'
      } }, 
      { title:'设备状态', dataIndex: 'isActive', key: 'isActive', render: text=>{
        //1 在线 0 离线
        if(text == 1) return (
          <div className={ styles.online }>
            <div></div>
            <p>在线</p>
          </div>
        )
        if(text == 0) return (
          <div className={ styles.offline }>
            <div></div>
            <p>离线</p>
          </div>
        )
      }},
      { title:'身份证读卡器状态', dataIndex: 'cardReaderStatus', key: 'cardReaderStatus', render: (text,record)=>{
        const { isActive, connType } = record
        if(connType == 1) return (
          <div className={ styles.noline }>
            <div></div>
            <p>暂无</p>
          </div>
        )
        if(isActive == 0) return (
          <div className={ styles.noline }>
            <div></div>
            <p>未上报</p>
          </div>
        )
        //1 正常 0 故障
        if(text == 1) return (
          <div className={ styles.online }>
            <div></div>
            <p>正常</p>
          </div>
        )
        if(text == 0) return (
          <div className={ styles.offline }>
            <div></div>
            <p>故障</p>
          </div>
        )
      }},
      { title:'门锁制卡器状态', dataIndex: 'lockStatus', key: 'lockStatus', render: (text, record)=>{
        const { isActive, connType } = record
        if(connType == 1) return (
          <div className={ styles.noline }>
            <div></div>
            <p>暂无</p>
          </div>
        )
        if(isActive == 0) return (
          <div className={ styles.noline }>
            <div></div>
            <p>未上报</p>
          </div>
        )
        //1 正常 0 故障
        if(text == 1) return (
          <div className={ styles.online }>
            <div></div>
            <p>正常</p>
          </div>
        )
        if(text == 0) return (
          <div className={ styles.offline }>
            <div></div>
            <p>故障</p>
          </div>
        )
      }},
      { title: '离线时间', dataIndex: 'logoutDate', key: 'logoutDate', render: text => {
          return (
            <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
          )
        }
      }, 
      { title:'客户端地址', dataIndex: 'remoteAddr', key: 'remoteAddr' }, 
      { title:'客户端端口', dataIndex: 'remotePort', key: 'remotePort' }, 
      { title:'服务端地址', dataIndex: 'serverAddr', key: 'serverAddr' }, 
      { title:'操作', dataIndex: 'x', key: 'x',fixed: 'right',
      width: 100, render:(text, record)=> {
        const { clientId, connType } = record
        return connType == 2?<Button onClick={() => dispatch({ type:'deviceMonitor/pushRouter',payload:{ pathname:`${INDEX_DEVICE_MONITOR}/charts`, search:{ deviceId:clientId } }})}  size='small' type='primary'>详情</Button>:null
      }}, 
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, filter, onReset: this.onReset };
    /** 表格参数 */
    const listProps = {
      loading,
      dataSource: teamList,
      columns,
      bordered: true,
      pagination: {
        ...pagination,
        onChange(cur, currentSize) {
          dispatch({
            type: 'deviceMonitor/getMonitorList',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
        onShowSizeChange(cur, currentSize) {
          dispatch({
            type: 'deviceMonitor/getMonitorList',
            payload: {
              ...filter,
              currentPage: cur,
              currentSize,
            },
          })
        },
      },
      scroll:{ x: 1600 }
    };

    return (
      <div className={styles.content}>
        <FilterPage {...filterProps} />
        <LocaleProvider locale={zhCN}>
          <Table className={styles.teamTable} {...listProps} />
        </LocaleProvider>
      </div>
    )
  }
}
