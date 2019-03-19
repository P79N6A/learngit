import React, { Component } from 'react';
import { connect } from 'dva';
import { Divider, Button, Spin, message, DatePicker } from 'antd'
import styles from './charts.less'
import { Chart, Geom, Axis, Tooltip, Legend } from "bizcharts";
import DataSet from "@antv/data-set";
import moment from 'moment'
import FilterPage from '@components/filter/index'
import { ENUM_MONITOR_STATUS } from '@utils/enums'
import { INDEX_DEVICE_MONITOR } from '@utils/pathIndex';
const { RangePicker } = DatePicker;
// 文本长度normal
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
function mapStateToProps(state) {
  return {charts:state.charts}
}
@connect(mapStateToProps)
export default class Day extends Component {
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
    const startTimes = new Date(submitData.startTime).getTime()
    const endTimes = new Date(submitData.endTime).getTime()
    if(startTimes == endTimes) {
      message.error('起始时间不得等于终止时间')
      return;
    }
    dispatch({ type: 'charts/save', payload: { filter:submitData } });
    dispatch({ type: 'charts/getMonitorInfo', payload: submitData });
  }

  onReset = () => {
    const { dispatch } = this.props
    dispatch({ type: 'charts/save', payload: { filter:{} } });
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch({ type:'charts/save', payload:{ loadingOp:true } })
  }
  getCharts = () => {
    const { dispatch, charts } = this.props
    const { loadingOp } = charts
    const { data } = this.props.charts;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: "fold",
      fields: ["freeMem1min", "maxAppMem1min", 'pidMemory1min', 'cpu1min', 'totalMem1min'],
      // 展开字段集
      key: "content",
      // key字段
      value: "number", // value字段
      allowDecimals:true
    });
    const cols = {
      timestamp: {
        range: [0, .95],
        alias: '时间',
        formatter: (title) => {
          return moment(parseFloat(title)).format('MM-DD HH:mm')
        }
      },
    };
    
    return (
      <Chart height={loadingOp?0:500} data={dv} scale={cols} placeholder forceFit onGetG2Instance={g2Chart => {
        g2Chart.animate(false);
        setTimeout(() => {
          dispatch({ type:'charts/save', payload:{ loadingOp:false } })
        }, 300);
      }} >
          <Legend />
          <Axis 
            name="timestamp"
          />
          <Axis
            name="number"
            label={{
              formatter: val => val
            }}
          />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="line"
            position="timestamp*number"
            size={2}
            color={"content"}
            tooltip={['content*number', (content, number)=>{
              return {
                name:ENUM_MONITOR_STATUS[content],
                value:number
              }
            }]}
          />
          <Geom
            type="point"
            position="timestamp*number"
            size={4}
            shape={"circle"}
            color={"content"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
            tooltip={['content*number', (content, number)=>{
              return {
                name:ENUM_MONITOR_STATUS[content],
                value:number
              }
            }]}
          />
        </Chart>
    )
  }

  render() {
    const { loadingOp, filter, data } = this.props.charts;
    const { dispatch } = this.props;

    /* 搜索表单配置项*/
    const filterItems = [
      {
        key: 'date',
        label: '时间范围',
        span: 8,
        formItemLayout,
        fieldAdapter: {
          showTime: { format: 'HH:mm:ss' },
          format: "YYYY-MM-DD HH:mm:ss",
          component: RangePicker,
        },
      },
    ];

    /** 搜索表单参数 */
    const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit, onReset: this.onReset };

    return (
      <div className={styles.content}>
        <h3 style={{ display:'inline-block' }}>设备监控详情</h3>
        <div className={styles.btnBox}>
          <Button type="primary" onClick={() => dispatch({type:'charts/pushRouter',payload:{ pathname:INDEX_DEVICE_MONITOR} })}>返回</Button>
        </div>
        <FilterPage {...filterProps} />
        { loadingOp && <Spin className={ styles.spin }/> }
        <Divider />
        { data && this.getCharts() }
      </div>
    )
  }
}
