# fotelSmartman
# fotelSmartman

自助入住后台管理系统

这是[generator-janna](http://gitlab.alibaba-inc.com/trip-tools/generator-janna)生成的项目模板

采用janna框架搭建的前端页面系统

* janna: http://janna.alibaba.net/

### 初始化
1. ```git clone```
2. ```tnpm i ```安装依赖

### 开发 & 调试
```
grunt newbranch          拉取最新分支
grunt dev                本地开发启动服务
grunt prepub:<message>   预发布 可使用nobuild跳过构建步骤
grunt publish:<message>  正式发布 可使用nobuild跳过构建步骤
```
#分支概述
daily/0.0.1 分支主要功能
daily/0.0.2 该分支包括监控大盘所有页面
daily/0.0.3 2018-08-02 升级pms、飞猪外部酒店编码 字段功能（只包含设备运维-设备管理模块）
daily/0.0.9 特征设置 -- 系统设置和酒店设置
daily/0.0.7 设备激活优化
daily/0.0.10 制卡规则 -- 酒店设置中
daily/0.0.11 驱动升级级联增加 类型
daily/0.0.12 错误码管理 name 改成 id/ 日志列表优化
daily/0.0.13 日志采集/远程监测
daily/0.0.14 酒店参数配置 增加 信用住和预授权付款吗
daily/0.0.15 酒店参数配置 增加 1 提示信息 2 是否包含早餐  3 是否显示添加房费 4 是否显示加入会员 5 会否显示手机号
daily/0.0.16 离店设置  离店详情
daily/0.0.17 预约入住优化列表  增加交易查询结账和解冻
daily/0.0.18 酒店参数增加 是否开启非信用住校验
daily/0.0.20 制卡数 酒店参数设置
daily/0.0.21 酒店参数  广告管理
daily/0.0.22 酒店参数  预授权冻结参数配置（包含下拉框
daily/0.0.23 [自助入住]运营统计数据2.0，明细汇总增加字段，增加总统计数
daily/0.0.24 酒店参数编辑中手机号去除限制
daily/0.0.25 部分水滴参数迁移到酒店参数配置
daily/0.0.26 每日汇总文字调整
daily/0.0.27 交易列表解冻结账等增加输入框（参数
daily/0.0.28 批量锁定和推送
daily/0.0.29 添加房号关联--增加房间位置字段
daily/0.0.30 数据报表--新增用户行为数据
daily/0.0.31 重构
daily/2.0.00 重构版本同步
daily/2.0.01 工单系统
daily/2.0.03 工单系统二期
daily/2.0.10 预授权扫脸配置
daily/2.0.20 同住人费旗舰店配置
daily/2.0.001 01补充版本
daily/2.0.001 01补充版本
daily/2.1.00 离店walkin配置
daily/2.1.10 报表优化,去除类型
daily/2.1.20 报表优化
daily/2.1.12 历史数据，每日汇总 订单明细 入住人明细
daily/1.1.11 oss地址获取
daily/2.1.30 两个配置 预定号查询，维吾尔二组通知，psb取消
daily/2.1.12 历史数据，每日汇总 订单明细 入住人明细
