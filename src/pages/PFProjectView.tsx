import React, {useEffect, useState} from 'react';
import {Bar} from '@ant-design/plots';
import {allProjectViewAsyncFetch, oneProjectViewAsyncFetch} from "../api/chartApi";
import {Button, Card, Col, Form, Input, Modal, notification, Row, Space, Switch, Tooltip} from 'antd';
import env from "../components/env";
import {NotificationPlacement} from "antd/es/notification/interface";
import PFSimpleDataList from "./PFSimpleDataList";
import {MyPartial, PFinderListReqParams} from "../interface/interface";
import PFSevenDaysDataList from "./PFSevenDaysDataList";
import AddDataSource from "./AddDataSource";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const PFProjectView: React.FC = () => {
    //主数据url
    let mainDataUrl = '/pFinderData/allProjectDataStatistics';

    //设置数据源
    const [settingDsVisible, setSettingDsVisible] = useState<boolean>(false); // 是否显示导出弹窗
    const [dsInputValue, setDsInputValue] = useState('');

    //pfProjectView图表的数据
    const [data, setData] = useState([]);

    //数据列表
    const [dataListVisible, setDataListVisible] = useState<boolean>(false); // 是否显示导出弹窗

    //最近7天数据列表
    const [sevenDaysDataListVisible, setSevenDaysDataListVisible] = useState<boolean>(false); // 是否显示导出弹窗

    //查询参数
    const [queryParams, setQueryParams] = useState<MyPartial<PFinderListReqParams>>({}); //  当前查询参数

    const [dataEnv, setDataEnv] = useState("");

    //表单
    const [form] = Form.useForm();

    //图表数据层级
    const [chartDataLevel, setChartDataLevel] = useState(1);
    const [currentSelectedData, setCurrentSelectedData] = useState({});

    //对话提示框
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement: NotificationPlacement, type: NotificationType, message: string) => {
        api[type]({
            message: message,
            // description: message,
            placement: placement,
        });
    };

    useEffect(() => {
        allProjectViewAsyncFetch(setData);
    }, []);

    //数据重置
    const formReset = () => {
        allProjectViewAsyncFetch(setData);
        setChartDataLevel(1);
    };

    const changeDataEnv = (open: boolean) => {
        let currentDateEnv = open ? "pro" : "pre";
        window.sessionStorage.setItem('currentDateEnv', currentDateEnv);
        allProjectViewAsyncFetch(setData);
    };

    function PFProjectChart() {
        const config = {
            data: data.sort((a: any, b: any) => {
                return a.type.localeCompare(b.type);
            }),
            isStack: true,
            xField: 'xField',
            yField: 'yField',
            seriesField: 'type',
            label: {
                // 可手动配置 label 数据标签位置
                position: 'middle',
                layout: [
                    // 柱形图数据标签位置自动调整
                    {
                        type: 'interval-adjust-position',
                    }, // 数据标签防遮挡
                    {
                        type: 'interval-hide-overlap',
                    }, // 数据标签文颜色自动调整
                    {
                        type: 'adjust-color',
                    },
                ],
            },
        };

        // @ts-ignore
        return (<Bar {...config} onReady={(bar) => {
            bar.on('interval:click', (...args: any) => {
                const data = args[0].data?.data;
                let type = data.type;
                let appName = data.appName;

                if (chartDataLevel === 1) {
                    let jsonObj;
                    if (type === 'error') {
                        jsonObj = {appName: appName, state: '2'};
                    } else {
                        jsonObj = {appName: appName, component: type};
                    }
                    setCurrentSelectedData(jsonObj);
                    setQueryParams(jsonObj);
                    setDataListVisible(true);
                    return;
                } else if (chartDataLevel === 2) {
                    let type = data.type;
                    let appName = data.appName;
                    let queryDate = data.year;
                    let queryDateBegin = queryDate + ' 00:00:00';
                    let queryDateEnd = queryDate + ' 23:59:59';

                    let jsonObj = {
                        appName: appName,
                        startTimeBegin: queryDateBegin,
                        startTimeEnd: queryDateEnd,
                        component: type
                    };
                    setQueryParams(jsonObj);
                    setDataListVisible(true);
                    return;
                }
            });

            bar.on('axis-label:click', (e: Event) => {
                console.log('axis-label:click');
                if (chartDataLevel === 1) {
                    let eventTarget = e.target;
                    // @ts-ignore
                    let jsonObj = {"appName": eventTarget.attrs.text};
                    setCurrentSelectedData(jsonObj);
                    setChartDataLevel(2);

                    oneProjectViewAsyncFetch(setData, jsonObj);
                    return;
                } else if (chartDataLevel === 2) {
                    let eventTarget = e.target;
                    // @ts-ignore
                    let appName = currentSelectedData.appName;
                    // @ts-ignore
                    let queryDate = eventTarget.attrs.text;
                    let queryDateBegin = queryDate + ' 00:00:00';
                    let queryDateEnd = queryDate + ' 23:59:59';
                    let jsonObj = {appName: appName, startTimeBegin: queryDateBegin, startTimeEnd: queryDateEnd};
                    setQueryParams(jsonObj);
                    setDataListVisible(true);
                    return;
                }
            });
        }}/>)
    }

    // @ts-ignore
    return (
        <>
            {contextHolder}
            <div style={{margin: "10px 20px"}}>
                <Card style={{marginBottom: "10px"}}>
                    <Form form={form} name="search-form" className="search-form">
                        <Row>
                            <Col span={2} style={{textAlign: "right"}}>
                                <div className="chart-btn">
                                    <Button type="primary" htmlType="submit"
                                            onClick={() => setSevenDaysDataListVisible(true)}>近一周数据</Button>
                                </div>
                            </Col>
                            <Col span={2} style={{textAlign: "right"}}>
                                <Space style={{height: "100%"}}>
                                    <Switch checked={window.sessionStorage.getItem("currentDateEnv") === "pro"}
                                            onClick={e => changeDataEnv(e)}/>
                                    <Tooltip title="prompt text">
                                        <span>仅线上</span>
                                    </Tooltip>
                                </Space>
                            </Col>
                            <Col span={18} style={{textAlign: "right"}}>
                                <div className="chart-btn">
                                    <Button type="primary" htmlType="submit" onClick={formReset}>重置</Button>
                                </div>
                            </Col>
                            <Col span={2} style={{textAlign: "right"}}>
                                <div className="chart-btn">
                                    <Button type="primary" htmlType="submit" disabled={true}
                                            onClick={() => setSettingDsVisible(true)}>数据订阅</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card>
                    <PFProjectChart></PFProjectChart>
                </Card>
            </div>

            {/* 数据源配置弹窗*/}
            {settingDsVisible ? (
                <Modal
                    title="配置数据源"
                    open={settingDsVisible}
                    wrapClassName="pFinder-setting-ds-modal"
                    closable={true}
                    // width={800}
                    onCancel={() => {
                        setSettingDsVisible(false);
                    }}
                    maskClosable={false}
                    footer={<></>}
                >
                    <Space direction="vertical" size="large" style={{width: '100%'}}>
                        <AddDataSource/>
                    </Space>
                </Modal>
            ) : null}

            {/*数据列表弹窗*/}
            {dataListVisible ? (
                <Modal
                    title="数据列表"
                    open={dataListVisible}
                    wrapClassName="pFinder-dataList-ds-modal"
                    closable={true}
                    width={2000}
                    onCancel={() => {
                        setDataListVisible(false);
                    }}
                    maskClosable={false}
                    footer={<></>}
                >
                    <PFSimpleDataList queryParams={queryParams}/>
                </Modal>
            ) : null}

            {/*最近7天数据弹窗*/}
            {sevenDaysDataListVisible ? (
                <Modal
                    title="最近7天数据列表"
                    open={sevenDaysDataListVisible}
                    wrapClassName="pFinder-7daysData-ds-modal"
                    closable={true}
                    width={2000}
                    onCancel={() => {
                        setSevenDaysDataListVisible(false);
                    }}
                    maskClosable={false}
                    footer={<></>}
                >
                    <PFSevenDaysDataList/>
                </Modal>
            ) : null}
        </>

    );

};

export default PFProjectView;
