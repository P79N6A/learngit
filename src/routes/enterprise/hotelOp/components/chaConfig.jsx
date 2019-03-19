import React,{ Component } from 'react'
import { Button, Popconfirm, Table, LocaleProvider } from 'antd'
import styles from './chaConfig.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import Modal from '@components/modal/modal'
import AddForm from './fromChaConfig/add'
import EditForm from './fromChaConfig/edit'
@withRef
export default class ConfigChaRef extends Component {
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
        const { all } = this.props
        this.modalAdd.changeVisible(true)
        if(this.addRefForm) {
            const { form } = this.addRefForm.props;
            const { resetFields } = form
            resetFields()
        }
        all()
    }

    handleOkAdd = () => {
        const { add } = this.props;
        const { form } = this.addRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
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
                update(values)
                this.modalEdit.changeVisible(false)
            }
        })
    }

    render() {
        const { loading, pagination, teamList, configChaInfo, standardAll } = this.props.editHotel;
        const { onChange, onShowSizeChange } = this.props;

        /* table列表*/
        const columns = [
            {
                title: '标准特征',
                dataIndex: 'featureStandardDesc',
                key: 'featureStandardDesc',
                width:'25%',
            },
            {
                title: '酒店特征码',
                dataIndex: 'pmsFeatureCode',
                key: 'pmsFeatureCode',
                width:'25%',
            },
            {
                title: '筛选条件',
                dataIndex: 'filterCondition',
                key: 'filterCondition',
                width:'25%',
                render:text => {
                    return text==1? <span>是</span>: <span>否</span>
                }
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
            columns,
            bordered: true,
            pagination: {
            ...pagination,
                showSizeChanger:true,
                showQuickJumper:true,
                showTotal: total => `共 ${total}条 数据`,
                onChange,
                onShowSizeChange
            },
        };
        return (
            <div className={styles.root}>
                <div className={styles.btnBox}>
                    <Button type="primary" onClick={ this.showAdd }>新增</Button>
                </div>
                <LocaleProvider locale={zhCN}>
                    <Table className={styles.teamTable} {...listProps} />
                </LocaleProvider>
                <Modal
                    notOkHidden = { true }
                    title="添加特征配置"
                    ref={ ref => this.modalAdd = ref }
                    onOk={ this.handleOkAdd }
                >
                    <AddForm standardAll={ standardAll } wrappedComponentRef={(form) => this.addRefForm = form} />
                </Modal>
                <Modal
                    notOkHidden = { true }
                    title="修改特征配置"
                    ref={ ref => this.modalEdit = ref }
                    onOk={ this.handleOkEdit }
                >
                    <EditForm data={ configChaInfo } wrappedComponentRef={(form) => this.editRefForm = form} />
                </Modal>
            </div>
        )
    }
}
