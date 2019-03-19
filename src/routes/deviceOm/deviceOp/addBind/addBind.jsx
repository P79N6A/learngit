import React,{ Component } from 'react'
import { connect } from 'dva'
import { Form, Divider, Input, message } from 'antd'
import Confirm from '@components/confirm/confirm'
import { INDEX_HOTEL_OP } from '@utils/pathIndex'
import styles from './addBind.less'
import { max } from '@utils/valid'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
const FormItem = Form.Item;
function mapStateToProps(state) {
    return { addBind:state.addBind }
}
@connect(mapStateToProps)
@Form.create()
export default class addBind extends Component {
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.hotelHint = draftToHtml(values.hotelHint)
                if(values.hotelHint.length >19999) {
                    message.error('入住政策不得多于2万字')
                    return
                }
                dispatch({type:'addBind/addBind',payload:values})
            }
        });
    }

    render() {
        const { dispatch, addBind } = this.props;
        const { hid } = addBind
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 10 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 20 },
              sm: { span: 8 },
            },
          };
        return (
            <div className={styles.root}>
                <h3>填写设备信息</h3>
                <Divider />
                <Form onSubmit={this.handleSubmit} className={styles.form}>
                    <FormItem {...formItemLayout} label="激活码">
                    {getFieldDecorator('activateCode', {
                        rules: [{ required: true, message: '请填写激活码' }],
                    })(
                        <Input placeholder="激活码" />
                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="飞猪酒店ID">
                    {getFieldDecorator('hid', {
                        rules: [{ required: false, message: '请填写飞猪酒店ID' }],
                        initialValue:hid
                    })(
                        <span>{ hid }</span>
                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="酒店入住政策">
                    {getFieldDecorator('hotelHint',{
                        rules:[ { validator:max(1000) }],
                        initialValue:EditorState.createEmpty()
                    })(
                        <Editor
                            localization={{ locale: 'zh' }}
                            wrapperClassName={ styles.wrapper }
                            editorClassName={ styles.editor }
                            toolbar={{
                                options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'history']
                            }}
                        />
                    )}
                    </FormItem>

                    <Confirm
                        formItemLayout = { formItemLayout }
                        doConfirm = { this.doConfirm }
                        doCancle = { () => dispatch({type:'addBind/pushRouter', payload:{ pathname:INDEX_HOTEL_OP} }) }
                    />
                </Form>   
            </div>
        )
    }
}