import React,{ Component } from 'react'
import { Row, Col, Table, LocaleProvider, DatePicker } from 'antd'
import styles from './dataDetail.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import FilterPage from '@components/filter/index'
const { RangePicker } = DatePicker;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
@withRef
export default class Standard extends Component {
    onFilterSubmit = (fields) => {
        const { save, getList } = this.props;
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
        save({ filter:submitData });
        getList({ ...submitData });
    }

    render() {
        const { loading, pagination, teamList } = this.props.logCollect;
        const { onChange, onShowSizeChange } = this.props;
        /* 搜索表单配置项*/
        const filterItems = [
            {
                key: 'date',
                label: '日期',
                span: 8,
                formItemLayout,
                fieldAdapter: {
                    showTime: { format: 'HH:mm:ss' },
                    format: "YYYY-MM-DD HH:mm:ss",
                    component: RangePicker,
                },
            }, 
        ];

        /* table列表*/
        const columns = [
            {
                title: '内容',
                dataIndex: 'x',
                key: 'x',
                width:'30%',
                render:(text, record) => {
                    return (
                        Object.keys(record).map((v,n)=>{
                            return <Row key={ n } className={ styles.row }>
                                        <Col span={ 3 }>{ v }</Col>
                                        <Col span={ 21 }>{ record[v] }</Col>
                                    </Row>
                        })
                    )
                }
            },
        ];
        /** 搜索表单参数 */
        const filterProps = { filterItems, onFilterSubmit: this.onFilterSubmit };
        /** 表格参数 */
        const listProps = {
            loading,
            dataSource: teamList,
            columns,
            bordered: true,
            pagination: {
            ...pagination,
                showSizeChanger:true,
                showQuickJumper:true,
                showTotal: total => null,
                onChange,
                onShowSizeChange
            },
        };
        return (
            <div className={styles.root}>
                <FilterPage {...filterProps} />
                <LocaleProvider locale={zhCN}>
                    <Table className={styles.teamTable} {...listProps} />
                </LocaleProvider>
            </div>
        )
    }
}
