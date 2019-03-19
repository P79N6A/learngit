import React,{ Component } from 'react'
import { Button, Popconfirm, Table, LocaleProvider } from 'antd'
import styles from './houseType.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import Modal from '@components/modal/modal'
import FilterPage from '@components/filter/index'
import AddForm from './formHouseType/add'
import EditForm from './formHouseType/edit'
@withRef
export default class HouseType extends Component {
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
        const { deleteHouseType } = this.props
        deleteHouseType(id)
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
        const { addHouseType } = this.props;
        const { form } = this.addRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                addHouseType(values)
                this.modalAdd.changeVisible(false)
            }
        })
    }

    showEdit = (id) => {
        const { getHouseById } = this.props
        if(this.editRefForm) {
            const { form } = this.editRefForm.props;
            const { resetFields } = form
            resetFields()
        }
        getHouseById(id) 
        this.modalEdit.changeVisible(true)
    }

    handleOkEdit = () => {
        const { updateHouseType } = this.props;
        const { form } = this.editRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                updateHouseType(values)
                this.modalEdit.changeVisible(false)
            }
        })
    }

    showImport = () => {
        this.modalImport.changeVisible(true)
        this.importRef && this.importRef.reset()
    }

    handleOkImport = () => {
        const { importRelation } = this.props;
        const { form } = this.importRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                importRelation(values)
                this.modalImport.changeVisible(false)
            }
        })
    }

    render() {
        const { loading, pagination, teamList, houseTypeInfo } = this.props.editHotel;
        const { onChange, onShowSizeChange, onFilterSubmit } = this.props;

        /* table列表*/
        const columns = [
            {
            title: '房间类型代码',
            dataIndex: 'roomTypeCode',
            key: 'roomTypeCode',
            width:'30%',
            },
            {
            title: '房间类型',
            dataIndex: 'roomTypeName',
            key: 'roomTypeName',
            width:'30%',
            },
            {
            title: '操作',
            dataIndex: '',
            key:'x',
            width: '40%',
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
                showSizeChanger:true,
                showQuickJumper:true,
                showTotal: total => `共 ${total}条 数据`,
                onChange,
                onShowSizeChange
            },
        };
        return (
            <div className={styles.root}>
                {/* <FilterPage {...filterProps} /> */}
                <div className={styles.btnBox}>
                    <Button type="primary" onClick={ this.showAdd }>新增</Button>
                </div>
                <LocaleProvider locale={zhCN}>
                    <Table className={styles.teamTable} {...listProps} />
                </LocaleProvider>
                <Modal
                    notOkHidden = { true }
                    title="添加房型"
                    ref={ ref => this.modalAdd = ref }
                    onOk={ this.handleOkAdd }
                >
                    <AddForm wrappedComponentRef={(form) => this.addRefForm = form} />
                </Modal>
                <Modal
                    notOkHidden = { true }
                    title="修改房型"
                    ref={ ref => this.modalEdit = ref }
                    onOk={ this.handleOkEdit }
                >
                    <EditForm data={ houseTypeInfo } wrappedComponentRef={(form) => this.editRefForm = form} />
                </Modal>
            </div>
        )
    }
}
