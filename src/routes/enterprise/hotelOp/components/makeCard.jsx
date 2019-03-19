import React,{ Component } from 'react'
import { Button, Popconfirm, Table, LocaleProvider, Row, Col, Select } from 'antd'
import styles from './makeCard.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import Modal from '@components/modal/modal'
import AddForm from './formMakeCard/add'
import EditForm from './formMakeCard/edit'
const { Option } = Select
@withRef
export default class MakeCard extends Component {
    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    delete_ = (id) => {
        const { del } = this.props
        del(id)
    }

    showAdd = () => {
        this.modalAdd.changeVisible(true)
        if(this.addRefForm) {
            const { form } = this.addRefForm.props;
            const { resetFields } = form
            resetFields()
        }
    }

    handleOkAdd = () => {
        const { add } = this.props;
        const { form } = this.addRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                values.checkoutTime = values.checkoutTime.format('HH:mm:ss')
                add(values)
                this.modalAdd.changeVisible(false)
            }
        })
    }

    showEdit = (id) => {
        const { info } = this.props
        if(this.editRefForm) {
            const { form } = this.editRefForm.props;
            const { resetFields } = form
            resetFields()
        }
        info(id)
        this.modalEdit.changeVisible(true)
    }

    handleOkEdit = () => {
        const { update } = this.props;
        const { form } = this.editRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                values.checkoutTime = values.checkoutTime.format('HH:mm:ss')
                update(values)
                this.modalEdit.changeVisible(false)
            }
        })
    }

    getRulesType = () => {
        const { globalCommonConfig, makeCardInitialValue } = this.props.editHotel
        if(globalCommonConfig) {
            return (
                <Select onChange={ this.onChange } value={ makeCardInitialValue } className={ styles.select }>
                    <Option key={1} value="1">默认制卡规则</Option>
                    <Option key={2} value="2">酒店制卡规则</Option>
                </Select>
            )
        } else {
            return null
        }
    }

    onChange = (v) => {
        const { save, getList } = this.props
        if(v == 1) {
            save({isShowDefaultRule:true, makeCardInitialValue:'1' })
        } else if(v == 2) {
            save({isShowDefaultRule:false, makeCardInitialValue:'2' })
            getList()
        }
    }

    setPropertiesMakeCard_ = () => {
        const { setPropertiesMakeCard } = this.props
        const { makeCardInitialValue } = this.props.editHotel
        setPropertiesMakeCard({ makecard_rule:makeCardInitialValue })
    }

    render() {
        const { onShowSizeChange, onChange } = this.props;
        const { loading, pagination, teamList, makeCardInfo, isShowDefaultRule } = this.props.editHotel;
        /* table列表*/
        const columns = [
            {
                title: '会员等级',
                dataIndex: 'memberLevel',
                key: 'memberLevel',
                width:'25%',
            },
            {
                title: '退房时间',
                dataIndex: 'checkoutTime',
                key: 'checkoutTime',
                width:'25%',
            },
            {
                title: '可开启的行政楼层',
                dataIndex: 'floors',
                key: 'floors',
                width:'25%',
            },
            {
                title: '操作',
                dataIndex: '',
                key:'x',
                width: '25%',
                render:(record) => {
                    const { id } = record;
                    return (
                    <div className={styles.options}>
                        <Button size='small' type="primary" onClick={ this.showEdit.bind(this,id) }>修改</Button>
                        <Popconfirm placement="topRight" title="请确认是否删除?" onConfirm={this.delete_.bind(this,id)} okText="确认" cancelText="取消">
                            <Button size="small" type="danger">删除</Button>
                        </Popconfirm>
                    </div>
                    )
                }
            }
        ];
        /** 表格参数 */
        const listProps = {
            loading,
            dataSource: teamList,
            rowKey:'id',
            columns,
            bordered: true,
            pagination: {
            ...pagination,
                showTotal: total => `共 ${total}条 数据`,
                onChange,
                onShowSizeChange
            },
        };
        return (
            <div className={styles.root}>
                <Row gutter={ 16 } className={ styles.title }>
                    <Col span={ 3 }><Button type="dashed">选择规则类型：</Button></Col>
                    <Col span={ 6 }>
                        { this.getRulesType() }
                    </Col>
                    <Col span={ 14 }>
                        <Button onClick={ this.setPropertiesMakeCard_ } type="primary">更新</Button>
                    </Col>
                </Row>
                {
                    isShowDefaultRule?
                    null:
                    <div className={styles.btnBox}>
                        <Button type="primary" onClick={ this.showAdd }>新增</Button>
                    </div>
                }
                {
                    isShowDefaultRule?
                    <div className={ styles.default }>
                        <p>退房时间：按预定订单中的checkIn日期+入住天数，计算退房时间。例如：checkIn日期是8月20日，入住两天，退房时间为8月22日12：00</p>
                        <p>可开启的行政楼层：无</p>
                    </div>:
                    <LocaleProvider locale={zhCN}>
                        <Table className={styles.teamTable} {...listProps} />
                    </LocaleProvider>
                }

                <Modal
                    notOkHidden = { true }
                    title="添加规则"
                    ref={ ref => this.modalAdd = ref }
                    onOk={ this.handleOkAdd }
                >
                    <AddForm wrappedComponentRef={(form) => this.addRefForm = form} />
                </Modal>
                <Modal
                    notOkHidden = { true }
                    title="修改规则"
                    ref={ ref => this.modalEdit = ref }
                    onOk={ this.handleOkEdit }
                >
                    <EditForm data={ makeCardInfo } wrappedComponentRef={(form) => this.editRefForm = form} />
                </Modal>
            </div>
        )
    }
}
