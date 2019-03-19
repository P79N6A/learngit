import React, { Component } from 'react'
import { Button, Popconfirm, Table, LocaleProvider, Input } from 'antd'
import styles from './relation.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import Modal from '@components/modal/modal'
import AddForm from './form/add'
import EditForm from './form/edit'
import ImportForm from './form/import'
// 文本长度normal
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
@withRef
export default class Param extends Component {
    reset = () => {
        const { form } = this.props
        const { resetFields } = form
        resetFields()
    }

    doCancle_ = () => {
        const { doCancle } = this.props
        doCancle()
    }

    deleteRelation_ = (id) => {
        const { action_delHotelRoomRel } = this.props
        action_delHotelRoomRel({ id })
    }
    showAdd = () => {
        this.modalAdd.changeVisible(true)
        if (this.addRefForm) {
            const { form } = this.addRefForm.props;
            const { resetFields } = form
            resetFields()
        }
    }

    handleOkAdd = () => {
        const { action_addHotelRoomRel } = this.props;
        const { form } = this.addRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                action_addHotelRoomRel(values)
                this.modalAdd.changeVisible(false)
            }
        })
    }

    showEdit = (id) => {
        const { action_getHotelRoomRel } = this.props
        if (this.editRefForm) {
            const { form } = this.editRefForm.props;
            const { resetFields } = form
            resetFields()
        }
        action_getHotelRoomRel(id)
        this.modalEdit.changeVisible(true)
    }

    handleOkEdit = () => {
        const { action_updateHotelRoomRel } = this.props;
        const { form } = this.editRefForm.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {
                action_updateHotelRoomRel(values)
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
        const { loading, pagination, teamList, relationInfo, fhHid } = this.props.editHotel;
        const { onChange, onShowSizeChange, getAllHotelRelation, onFilterSubmit } = this.props;

        const filterItems = [
            {
                key: 'pmsRoomCode',
                label: 'PMS房间号',
                span: 8,
                formItemLayout,
                fieldAdapter: {
                    placeholder: '请填写PMS房间号',
                    component: Input,
                },
            },
        ];

        /* table列表*/
        const columns = [
            {
                title: 'PMS房间号',
                dataIndex: 'pmsRoomCode',
                key: 'pmsRoomCode',
                width: '15%',
            },
            {
                title: '酒店房间号',
                dataIndex: 'hotelRoomCode',
                key: 'hotelRoomCode',
                width: '15%',
            },
            {
                title: '房间位置',
                dataIndex: 'roomLocation',
                key: 'roomLocation',
                width: '15%',
            },
            {
                title: 'PSB房间号',
                dataIndex: 'psbRoomCode',
                key: 'psbRoomCode',
                width: '20%',
            }, {
                title: '门锁房间号',
                dataIndex: 'cardRoomCode',
                key: 'cardRoomCode',
                width: '20%',
            }, {
                title: '操作',
                dataIndex: '',
                key: 'x',
                width: '15%',
                render: (record) => {
                    const { id } = record;
                    return (
                        <div className={styles.options}>
                            <Button size='small' type="primary" onClick={this.showEdit.bind(this, id)}>修改</Button>
                            <Popconfirm placement="topRight" title="请确认是否删除?" onConfirm={this.deleteRelation_.bind(this, id)} okText="确认" cancelText="取消">
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
            rowKey: 'id',
            columns,
            bordered: true,
            pagination: {
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total}条 数据`,
                onChange,
                onShowSizeChange
            },
        };
        return (
            <div className={styles.root}>
                {/* <FilterPage {...filterProps} /> */}
                <div className={styles.btnBox}>
                    <Button type="primary" style={{ marginRight: '10px' }} onClick={this.showAdd}>新增</Button>
                    <Popconfirm placement="topRight" title="请确认是否全部删除?" onConfirm={this.deleteRelation_.bind(this, 'all')} okText="确认" cancelText="取消">
                        <Button type="danger">全部删除</Button>
                    </Popconfirm>
                    <Button className={styles.import} type="primary" onClick={this.showImport} >数据导入</Button>
                </div>
                <LocaleProvider locale={zhCN}>
                    <Table className={styles.teamTable} {...listProps} />
                </LocaleProvider>
                <Modal
                    notOkHidden={true}
                    title="添加房号关联"
                    ref={ref => this.modalAdd = ref}
                    onOk={this.handleOkAdd}
                >
                    <AddForm wrappedComponentRef={(form) => this.addRefForm = form} />
                </Modal>
                <Modal
                    notOkHidden={true}
                    title="修改房号关联"
                    ref={ref => this.modalEdit = ref}
                    onOk={this.handleOkEdit}
                >
                    <EditForm data={relationInfo} wrappedComponentRef={(form) => this.editRefForm = form} />
                </Modal>
                <Modal
                    title="数据导入"
                    ref={ref => this.modalImport = ref}
                >
                    <ImportForm getAllHotelRelation={getAllHotelRelation} fhHid={fhHid} ref={ref => this.importRef = ref} />
                </Modal>
            </div>
        )
    }
}
