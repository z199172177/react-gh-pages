//PFinder数据列表
export interface PFinderTableItem {
    id: number;
    appName: string;
    tranceId: string;
    startTime: string[];
    ip: string;
    method: string;
    component: string;
    state: string;
    elapsedTime: number;
    detailUrl: string;
    env: string;
}

//PFinder检索表单
export interface PFinderFilterForm {
    appName?: string; // 应用名称
    component?: string; // 组件类型
    state?: string; // 状态
    startTime?: string[]; // 创建时间
}

// PFinder数据请求参数
export interface PFinderListReqParams {
    pageNum: number; // 页码
    pageSize: number; // 每页条数
    appName?: string;
    component?: string;
    state?: string;
    startTimeBegin?: string;
    startTimeEnd?: string;
    sortField?: string;
    sortOrder?: string;
    evn?: string;
}

//PFinder slowSql数据列表
export interface PFinderSlowSqlTableItem {
    id: number;
    tranceId: string;
    appName: string;
    platform: string;
    component: string;
    elapsedTime: number;
    hasError: number;
    operation: string;
    protocol: string;
    startTime: number;
    dbName: string;
    hostInfo: string;
    method: string;
    type: string;
    sqlInfo: string;
    userName: string;
    fqon: string;
    gmtCreate: number;
    gmtModified: number;
}


// PFinder数据请求参数
export interface PFinderSlowSqlListReqParams {
    pageNum: number; // 页码
    pageSize: number; // 每页条数
    appName?: string;
    tranceId?: string;
}

export type MyPartial<T> = { [K in keyof T]?: T[K] };

//PFinder 数据源
export interface PFinderDataSource {
    appName: string;
    platform: string;
    dataType: string;
    methodId: number;
    metricName: string;
}

//慢SQL分析
export interface SqlDiagnosticReq {
    index: number;
    sql: string;
    elapsedTime: number;
    prompt: string;
    componentDisabled: any;
}

//异常日志分析
export interface ErrLogDiagnosticReq {
    logContent: string;
    componentDisabled: any;
}

//gitDiff分析，请求
export interface GitDiffAnalysisReq {
    gitDiffContent: string;
    componentDisabled: any;
}
