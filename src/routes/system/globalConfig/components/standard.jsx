import React,{ Component } from 'react'
import { Button, Popconfirm, Table, LocaleProvider } from 'antd'
import styles from './standard.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import Modal from '@components/modal/modal'
import AddForm from './formStandard/add'
import EditForm from './formStandard/edit'
@withRef
export default class Standard extends Component {
    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    confirmForbid = (id,status) => {
        const { updateStandard } = this.props;
        updateStandard({ id, status })
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
        const { action_addStandard } = this.props;
        const { form } = this.addRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                action_addStandard(values)
                this.modalAdd.changeVisible(false)
            }
        })
    }

    showEdit = (id) => {
        const { getStandardById } = this.props
        if(this.editRefForm) {
            const { form } = this.editRefForm.props;
            const { resetFields } = form
            resetFields()
        }
        getStandardById(id) 
        this.modalEdit.changeVisible(true)
    }

    handleOkEdit = () => {
        const { updateStandard } = this.props;
        const { form } = this.editRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                updateStandard(values)
                this.modalEdit.changeVisible(false)
            }
        })
    }

    render() {
        const { loading, pagination, teamList, standardInfo } = this.props.globalConfig;
        const { onChange, onShowSizeChange } = this.props;

        /* table列表*/
        const columns = [
            {
            title: '标准特征',
            dataIndex: 'featureDesc',
            key: 'featureDesc',
            width:'30%',
            },
            {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width:'30%',
            render:text => {
                return text == 1?<span>启用</span>:<span>禁用</span>
            }
            },
            {
            title: '操作',
            dataIndex: '',
            key:'x',
            width: '40%',
            render:(record) => {
                const { id, status } = record;
                return (
                <div className={styles.options}>
                    <Button size='small' type="primary" onClick={ this.showEdit.bind(this,id) }>修改</Button>
                    {
                        status === 1?
                        (
                        <Popconfirm placement="topRight" title="请确认是否禁用?" onConfirm={this.confirmForbid.bind(this,id,2)} okText="确认" cancelText="取消">
                            <Button size='small' type="danger">禁用</Button>
                        </Popconfirm>
                        ):
                        (
                        <Popconfirm placement="topRight" title="请确认是否启用?" onConfirm={this.confirmForbid.bind(this,id,1)} okText="确认" cancelText="取消">
                            <Button size='small' type="primary">启用</Button>
                        </Popconfirm>
                        )
                    }
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
                    title="添加标准特征"
                    ref={ ref => this.modalAdd = ref }
                    onOk={ this.handleOkAdd }
                >
                    <AddForm wrappedComponentRef={(form) => this.addRefForm = form} />
                </Modal>
                <Modal
                    notOkHidden = { true }
                    title="修改标准特征"
                    ref={ ref => this.modalEdit = ref }
                    onOk={ this.handleOkEdit }
                >
                    <EditForm data={ standardInfo } wrappedComponentRef={(form) => this.editRefForm = form} />
                </Modal>
            </div>
        )
    }
}
