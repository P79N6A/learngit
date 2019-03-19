import React,{ Component } from 'react'
import { Button, Popconfirm, Table, LocaleProvider } from 'antd'
import styles from './product.less'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import withRef from '@components/HOC/withRef/withRef'
import Modal from '@components/modal/modal'
import AddForm from './formProduct/add'
import EditForm from './formProduct/edit'
import moment from 'moment'
@withRef
export default class Product extends Component {
    delete_ = (id) => {
        const { del } = this.props
        del(id)
    }

    showAdd = () => {
        const { getTypeLists } = this.props
        this.modalAdd.changeVisible(true)
        if(this.addRefForm) {
            const { form } = this.addRefForm.props;
            const { resetFields } = form
            resetFields()
        }
        getTypeLists()
    }

    //添加产品确认
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

    //展示产品tab 编辑框（包含tab1 产品基本信息  tab2 pms过零时配置）
    showEdit = (id) => {
        const { info, getTypeLists } = this.props
        //重置编辑内容
        this.editFormRef && this.editFormRef.reset()
        info(id)
        getTypeLists() 
        this.modalEdit.changeVisible(true)
    }

    //隐藏产品tab 编辑框
    hideModalEdit = () => {
        this.modalEdit && this.modalEdit.changeVisible(false)
    }

    render() {
        const { editPartner, update, updateMidnight, getByPmsCode } = this.props
        const { loading, pagination, teamList, typeLists } = editPartner;
        const { onChange, onShowSizeChange } = this.props;
        console.log('.....',editPartner)
        /* table列表*/
        const columns = [
            {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width:'25%',
            render: text => {
                return (
                <p>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</p>
                )
            }
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
                width:'25%',
            },
            {
                title: '产品状态',
                dataIndex: 'productStatus',
                key: 'productStatus',
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
            rowKey:'id',
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
                    title="添加产品"
                    ref={ ref => this.modalAdd = ref }
                    onOk={ this.handleOkAdd }
                >
                    <AddForm typeLists={ typeLists } wrappedComponentRef={(form) => this.addRefForm = form} />
                </Modal>
                <Modal
                    notOkHidden = { true }
                    title="修改产品"
                    width={ 800 }
                    noFooter={ true }
                    ref={ ref => this.modalEdit = ref }
                >
                    <EditForm ref={ ref => this.editFormRef = ref } getByPmsCode={ getByPmsCode } doCancel={ this.hideModalEdit } updateMidnight={ updateMidnight } update={ update } editPartner={ editPartner } wrappedComponentRef={(form) => this.editRefForm = form} />
                </Modal>
            </div>
        )
    }
}
