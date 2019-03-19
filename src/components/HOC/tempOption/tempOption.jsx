import React from 'react';
import { message } from 'antd'
import { ERROR_FORM } from '@utils/resCode'
import { pickBy } from 'lodash'
import { INDEX_DEVICE_TEM_OP } from '@utils/pathIndex'

/**
 * minxing
 * 此类用来拓展template下 addTemp/typeConfig和editTemp两个功能界面都相似的组件，统一管理相同功能
 * @param {*} WrappedComponent 
 */
const TempOption = WrappedComponent => class extends WrappedComponent {
    getTrueParams = (v) => {
        for(let key in v) {
            /**
             * 该判断主要将添加行的行数据组合成真正的参数，因为存在删除这一样，导致数组中会存在empty的情况所以下标重新定义
             */
            if(key.includes('addLine')) {
                let addLineArr = key.split('_');
                v[addLineArr[1]] = v[addLineArr[1]]?v[addLineArr[1]]:[];
                let addLineTrueV = v[addLineArr[1]];
                //过滤empty 获取下标书组
                let indexInit = 0;
                v[key].map((vAdd) => {
                    if(!addLineTrueV[indexInit]) {
                        addLineTrueV[indexInit] = {};
                    }
                    addLineTrueV[indexInit][addLineArr[2]] = vAdd;
                    indexInit++;
                })
            }
        }
    }
    handleSubmit = (e) => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            //遍历参数重新组装需要参数
            this.getTrueParams(values);
            if (err) {
                message.error(ERROR_FORM)
            } else {
                for (const key in values) {
                    if(typeof values[key] == 'object') values[key] = JSON.stringify(values[key])
                }
                //去除不需要的临时数据
                values = pickBy(values,(v,key) => {
                    if(!key.includes('tem') && !key.includes('addLine') && !key.includes('keys')) return true;
                })
                if(this.props.location.pathname === `${INDEX_DEVICE_TEM_OP}/addTemp/typeConfig`) {
                    dispatch({type:'typeConfig/saveTemp',payload:values})
                } else if(this.props.location.pathname === `${INDEX_DEVICE_TEM_OP}/editTemp`) {
                    dispatch({type:'editTemp/saveTemp',payload:values})
                }
            }
        });
    }

    render() {
      return super.render();
    }
}

export default TempOption;