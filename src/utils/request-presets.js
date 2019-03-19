
import { buildinPresets, postApi, getApi } from '@alife/scu/lib/request'
export const presetsWithResultGetter = [checkStatus, parseJSON, getResult]
export const presetsWithSuccessJudge = [checkStatus, parseJSON, successJudge]
export const resConfig = { timeout: 8000, isMock: true }
const { checkStatus, parseJSON, getResult, successJudge } = buildinPresets
const resConfigSelf = (timeout) => {
    return timeout?{ timeout }:resConfig
}
const MOCK_FLAG = {
    USE_JSON : 'USE_JSON',//使用本地测试数据
    USE_PRE : 'USE_PRE',//使用预发布数据
    USE_PUB : 'USE_PUB',//使用发布数据
}

//根据flag来 设定mock的地址
export const getMock = ({ urlJson, urlPre, urlPub },retType = MOCK_FLAG.USE_JSON) => {
    if(retType === MOCK_FLAG.USE_JSON) {
        return urlJson;
    } else if(retType === MOCK_FLAG.USE_PRE) {
        return urlPre;
    } else if(retType === MOCK_FLAG.USE_PUB) {
        return urlPub;
    }
}

const jsonHeader = new Headers({
    'Content-Type': 'application/json',
})

const getFetchOptionJson = params => ({ headers: jsonHeader, body: JSON.stringify(params) })
const getFetchOptionJson2 = params => ({ redirect: 'manual', credentials: "include", headers: jsonHeader, body: JSON.stringify(params) })

/**
 * @param {name} 接口名称
 * @param {url} 真正url
 * @param {evn} 使用mock还是本地调试 USE_JSON/USE_PRE
 * @param {urlJson} mockUrl @default {/src/mock/default/default.json}
 * @param {method} 请求方法 @default {post}
 * @param {body} 请求body数据格式 formData/json @default {formData}
 * @param {preHost} 本地调试接口ip
 */
export const getAction = ({ name, url, urlJson='/src/mock/default/default.json', method='post', evn, body = 'json', preHost }) => {
    let api = method=='post'?postApi:getApi
    if(resConfig.isMock && evn == 'USE_JSON') {//日常调试 如果使用json，不走本地 方法为get
        api = getApi
        body = 'formData'
    }
    url = `${url}.do`;
    return {
        name,
        fn(params) {
        return api({
            url,
            mock: getMock({
            urlJson,
            urlPre:`${preHost}${url}`,
            },evn),
        }, params, [checkStatus, parseJSON], body=='formData'?{ ...resConfig }:{ ...resConfig, fetchOptions:getFetchOptionJson(params) })
        }
    }
}

/**
 * @param {name} 接口名称
 * @param {url} 真正url
 * @param {evn} 使用mock还是本地调试 USE_JSON/USE_PRE
 * @param {urlJson} mockUrl @default {/src/mock/default/default.json}
 * @param {method} 请求方法 @default {post}
 * @param {body} 请求body数据格式 formData/json @default {formData}
 * @param {hostUrl} 跨域接口
 */
export const getActionCors = ({ name, url, urlJson='/src/mock/default/default.json', method='post', evn, body = 'json', hostUrl }) => {
    let api = method=='post'?postApi:getApi
    if(resConfig.isMock && evn == 'USE_JSON') {//日常调试 如果使用json，不走本地 方法为get
        api = getApi
        body = 'formData'
    }
    return {
        name,
        fn(params) {
        return api({
            url,
            mock: getMock({
                urlJson,
                urlPre:`${hostUrl}${url}`,
            },evn),
        }, params, [checkStatus, parseJSON], body=='formData'?{ timeout: 5000, isMock: true }:{ timeout: 5000, isMock: true, fetchOptions:getFetchOptionJson2(params) })
        }
    }
}
