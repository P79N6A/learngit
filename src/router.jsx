import React from 'react'
import { routerRedux, Route, Redirect, Switch } from 'dva/router'
import dynamic from './dynamic'
import MainLayout from './components/layout/main-layout'
import Exception from './routes/exception'

const { ConnectedRouter } = routerRedux
function RouterConfig({ history, app }) {
  const toDynamic = (component, models = []) => dynamic(app, models, component)
  return (
    <ConnectedRouter history={history}>
      <Route path="/">
        <MainLayout>
          <Switch>
            <Route exact path="/" component={toDynamic(() => import(/* webpackChunkName: "welcome" */'./routes/index-page'))} />
            
            <Route exact path="/deviceOm/deviceOp" component={toDynamic(() => import(/* webpackChunkName: "device" */'./routes/deviceOm/deviceOp/device'),['deviceOm/deviceOp/device'])} />
            <Route exact path="/deviceOm/deviceOp/addBind" component={toDynamic(() => import(/* webpackChunkName: "addBind" */'./routes/deviceOm/deviceOp/addBind/addBind'),['deviceOm/deviceOp/addBind/addBind'])} />
            <Route exact path="/deviceOm/deviceOp/getParam" component={toDynamic(() => import(/* webpackChunkName: "getParam" */'./routes/deviceOm/deviceOp/getParam/getParam'),['deviceOm/deviceOp/getParam/getParam'])} />
            <Route exact path="/deviceOm/deviceOp/getParam/paramConfig" component={toDynamic(() => import(/* webpackChunkName: "paramConfig" */'./routes/deviceOm/deviceOp/getParam/paramConfig/paramConfig'),['deviceOm/deviceOp/getParam/paramConfig/paramConfig'])} />
            
            <Route exact path="/deviceOm/deviceOp/template" component={toDynamic(() => import(/* webpackChunkName: "template" */'./routes/deviceOm/deviceOp/template/template'),['deviceOm/deviceOp/template/template'])} />
            <Route exact path="/deviceOm/deviceOp/template/addTemp" component={toDynamic(() => import(/* webpackChunkName: "addTemp" */'./routes/deviceOm/deviceOp/template/addTemp/addTemp'),['deviceOm/deviceOp/template/addTemp/addTemp'])} />
            <Route exact path="/deviceOm/deviceOp/template/editTemp" component={toDynamic(() => import(/* webpackChunkName: "editTemp" */'./routes/deviceOm/deviceOp/template/editTemp/editTemp'),['deviceOm/deviceOp/template/editTemp/editTemp'])} />
            <Route exact path="/deviceOm/deviceOp/template/addTemp/typeConfig" component={toDynamic(() => import(/* webpackChunkName: "typeConfig" */'./routes/deviceOm/deviceOp/template/addTemp/typeConfig/typeConfig'),['deviceOm/deviceOp/template/addTemp/typeConfig/typeConfig'])} />
            
            <Route exact path="/deviceOm/deviceOp/logCollect" component={toDynamic(() => import(/* webpackChunkName: "logCollect" */'./routes/deviceOm/deviceOp/logCollect/logCollect'),['deviceOm/deviceOp/logCollect/logCollect'])} />
            <Route exact path="/deviceOm/deviceOp/detection" component={toDynamic(() => import(/* webpackChunkName: "detection" */'./routes/deviceOm/deviceOp/detection/detection'),['deviceOm/deviceOp/detection/detection'])} />
            <Route exact path="/deviceOm/deviceOp/mockSet" component={toDynamic(() => import(/* webpackChunkName: "mockSet" */'./routes/deviceOm/deviceOp/mockSet/mockSet'),['deviceOm/deviceOp/mockSet/mockSet'])} />
            
            <Route exact path="/deviceOm/deviceMonitor" component={toDynamic(() => import(/* webpackChunkName: "deviceMonitor" */'./routes/deviceOm/deviceMonitor/deviceMonitor'),['deviceOm/deviceMonitor/deviceMonitor'])} />
            <Route exact path="/deviceOm/deviceMonitor/charts" component={toDynamic(() => import(/* webpackChunkName: "charts" */'./routes/deviceOm/deviceMonitor/charts'),['deviceOm/deviceMonitor/charts'])} />
            <Route exact path="/deviceOm/deviceOp/batch" component={toDynamic(() => import(/* webpackChunkName: "batch" */'./routes/deviceOm/deviceOp/batchOp/batch'),['deviceOm/deviceOp/batchOp/batch'])} />
            
            <Route exact path="/enterprise/hotelOp" component={toDynamic(() => import(/* webpackChunkName: "hotelOp" */'./routes/enterprise/hotelOp/hotel'),['enterprise/hotelOp/hotel'])} />
            <Route exact path="/enterprise/hotelOp/addHotel" component={toDynamic(() => import(/* webpackChunkName: "addHotel" */'./routes/enterprise/hotelOp/addHotel'),['enterprise/hotelOp/addHotel'])} />
            <Route exact path="/enterprise/hotelOp/editHotel" component={toDynamic(() => import(/* webpackChunkName: "editHotel" */'./routes/enterprise/hotelOp/editHotel'),['enterprise/hotelOp/editHotel'])} />
            
            <Route exact path="/enterprise/partnerOp" component={toDynamic(() => import(/* webpackChunkName: "partnerOp" */'./routes/enterprise/partnerOp/partnerOp'),['enterprise/partnerOp/partnerOp'])} />
            <Route exact path="/enterprise/partnerOp/addPartner" component={toDynamic(() => import(/* webpackChunkName: "addPartner" */'./routes/enterprise/partnerOp/addPartner'),['enterprise/partnerOp/addPartner'])} />
            <Route exact path="/enterprise/partnerOp/editPartner" component={toDynamic(() => import(/* webpackChunkName: "editPartner" */'./routes/enterprise/partnerOp/editPartner'),['enterprise/partnerOp/editPartner'])} />
            
            <Route exact path="/enterprise/blocOp" component={toDynamic(() => import(/* webpackChunkName: "blocOp" */'./routes/enterprise/blocOp/blocOp'),['enterprise/blocOp/blocOp'])} />
            <Route exact path="/enterprise/blocOp/addBloc" component={toDynamic(() => import(/* webpackChunkName: "addBloc" */'./routes/enterprise/blocOp/addBloc'),['enterprise/blocOp/addBloc'])} />
            <Route exact path="/enterprise/blocOp/editBloc" component={toDynamic(() => import(/* webpackChunkName: "editBloc" */'./routes/enterprise/blocOp/editBloc'),['enterprise/blocOp/editBloc'])} />
            
            <Route exact path="/deviceOm/appVM" component={toDynamic(() => import(/* webpackChunkName: "appVM" */'./routes/deviceOm/appVM/appVM'),['deviceOm/appVM/appVM'])} />
            <Route exact path="/deviceOm/appVM/addVersion" component={toDynamic(() => import(/* webpackChunkName: "addVersion" */'./routes/deviceOm/appVM/addVersion'),['deviceOm/appVM/addVersion'])} />
            <Route exact path="/deviceOm/appVM/editVersion" component={toDynamic(() => import(/* webpackChunkName: "editVersion" */'./routes/deviceOm/appVM/editVersion'),['deviceOm/appVM/editVersion'])} />
            
            <Route exact path="/deviceOm/psbUpload" component={toDynamic(() => import(/* webpackChunkName: "psbUpload" */'./routes/deviceOm/psbUpload/psbUpload'),['deviceOm/psbUpload/psbUpload'])} />
            
            <Route exact path="/dealOm/dealQuery" component={toDynamic(() => import(/* webpackChunkName: "dealQuery" */'./routes/dealOm/dealQuery/dealQuery'),['dealOm/dealQuery/dealQuery'])} />
            <Route exact path="/dealOm/dealQuery/dealDetail" component={toDynamic(() => import(/* webpackChunkName: "dealDetail" */'./routes/dealOm/dealQuery/dealDetail'),['dealOm/dealQuery/dealDetail'])} />

            <Route exact path="/system/errorM/codeDefine" component={toDynamic(() => import(/* webpackChunkName: "codeDefine" */'./routes/system/errorM/codeDefine/codeDefine'),['system/errorM/codeDefine/codeDefine','system/errorM/common'])} />
            <Route exact path="/system/errorM/codeDefine/addDefine" component={toDynamic(() => import(/* webpackChunkName: "addDefine" */'./routes/system/errorM/codeDefine/addDefine'),['system/errorM/codeDefine/addDefine','system/errorM/common'])} />
            <Route exact path="/system/errorM/codeDefine/editDefine" component={toDynamic(() => import(/* webpackChunkName: "editDefine" */'./routes/system/errorM/codeDefine/editDefine'),['system/errorM/codeDefine/editDefine','system/errorM/common'])} />
            <Route exact path="/system/errorM/codeMap" component={toDynamic(() => import(/* webpackChunkName: "codeMap" */'./routes/system/errorM/codeMap/codeMap'),['system/errorM/codeMap/codeMap'])} />
            <Route exact path="/system/errorM/codeMap/addMap" component={toDynamic(() => import(/* webpackChunkName: "addMap" */'./routes/system/errorM/codeMap/addMap'),['system/errorM/codeMap/addMap'])} />
            <Route exact path="/system/errorM/codeMap/editMap" component={toDynamic(() => import(/* webpackChunkName: "editMap" */'./routes/system/errorM/codeMap/editMap'),['system/errorM/codeMap/editMap'])} />
            <Route exact path="/system/errorM/matchRule" component={toDynamic(() => import(/* webpackChunkName: "matchRule" */'./routes/system/errorM/matchRule/matchRule'),['system/errorM/matchRule/matchRule'])} />
            <Route exact path="/system/errorM/matchRule/addMatch" component={toDynamic(() => import(/* webpackChunkName: "addMatch" */'./routes/system/errorM/matchRule/addMatch'),['system/errorM/matchRule/addMatch'])} />
            <Route exact path="/system/errorM/matchRule/editMatch" component={toDynamic(() => import(/* webpackChunkName: "editMatch" */'./routes/system/errorM/matchRule/editMatch'),['system/errorM/matchRule/editMatch'])} />
            <Route exact path="/system/errorM/matchRulePartner" component={toDynamic(() => import(/* webpackChunkName: "matchRulePartner" */'./routes/system/errorM/matchRulePartner/matchRulePartner'),['system/errorM/matchRulePartner/matchRulePartner'])} />
            <Route exact path="/system/errorM/matchRulePartner/addMatchPartner" component={toDynamic(() => import(/* webpackChunkName: "addMatchPartner" */'./routes/system/errorM/matchRulePartner/addMatchPartner'),['system/errorM/matchRulePartner/addMatchPartner'])} />
            <Route exact path="/system/errorM/matchRulePartner/editMatchPartner" component={toDynamic(() => import(/* webpackChunkName: "editMatchPartner" */'./routes/system/errorM/matchRulePartner/editMatchPartner'),['system/errorM/matchRulePartner/editMatchPartner'])} />
            <Route exact path="/system/operate" component={toDynamic(() => import(/* webpackChunkName: "operate" */'./routes/system/operate/operate'),['system/operate/operate'])} />

            <Route exact path="/userMa/people" component={toDynamic(() => import(/* webpackChunkName: "people" */'./routes/userMa/people/people'),['userMa/people/people'])} />
            <Route exact path="/orderMa/order" component={toDynamic(() => import(/* webpackChunkName: "order" */'./routes/orderMa/order/order'),['orderMa/order/order'])} />
            <Route exact path="/orderMa/checkout" component={toDynamic(() => import(/* webpackChunkName: "checkout" */'./routes/orderMa/checkout/checkout'),['orderMa/checkout/checkout'])} />
            <Route exact path="/orderMa/walkin" component={toDynamic(() => import(/* webpackChunkName: "walkin" */'./routes/orderMa/walkin/walkin'),['orderMa/walkin/walkin'])} />
            <Route exact path="/dataAnaly/day" component={toDynamic(() => import(/* webpackChunkName: "day" */'./routes/dataAnaly/day/day'),['dataAnaly/day/day'])} />
            
            <Route exact path="/dataOld/dayOld" component={toDynamic(() => import(/* webpackChunkName: "dayOld" */'./routes/dataReport/day/day'),['dataReport/day/day'])} />
            <Route exact path="/dataOld/orderOld" component={toDynamic(() => import(/* webpackChunkName: "orderOld" */'./routes/dataReport/order/order'),['dataReport/order/order'])} />
            <Route exact path="/dataOld/peopleOld" component={toDynamic(() => import(/* webpackChunkName: "peopleOld" */'./routes/dataReport/people/people'),['dataReport/people/people'])} />

            <Route exact path="/logOm/dayLog" component={toDynamic(() => import(/* webpackChunkName: "dayLog" */'./routes/logOm/dayLog/dayLog'),['logOm/dayLog/dayLog'])} />
            <Route exact path="/logOm/dayLog/detail" component={toDynamic(() => import(/* webpackChunkName: "detail" */'./routes/logOm/dayLog/detail/detail'),['logOm/dayLog/detail/detail'])} />
            <Route exact path="/logOm/message" component={toDynamic(() => import(/* webpackChunkName: "messageLog" */'./routes/logOm/message/messageLog'),['logOm/message/messageLog'])} />
            <Route exact path="/logOm/behavior" component={toDynamic(() => import(/* webpackChunkName: "behavior" */'./routes/logOm/behavior/behavior'),['logOm/behavior/behavior'])} />
            <Route exact path="/logOm/behavior/detail" component={toDynamic(() => import(/* webpackChunkName: "detailBehavior" */'./routes/logOm/behavior/detail/detail'),['logOm/behavior/detail/detail'])} />

            <Route exact path="/workorder/implement" component={toDynamic(() => import(/* webpackChunkName: "implement" */'./routes/workorder/implement/implement'),['workorder/implement/implement'])} />
            <Route exact path="/workorder/implement/detail" component={toDynamic(() => import(/* webpackChunkName: "implementDetail" */'./routes/workorder/implement/detail/implementDetail'),['workorder/implement/implementDetail'])} />

            <Route exact path="/system/globalConfig" component={toDynamic(() => import(/* webpackChunkName: "globalConfig" */'./routes/system/globalConfig/globalConfig'),['system/globalConfig/globalConfig'])} />

            <Route path="/exception/:code" component={Exception} />
            <Redirect to="/exception/404" />
          </Switch>
        </MainLayout>
      </Route>
    </ConnectedRouter>
  )
}

export default RouterConfig
