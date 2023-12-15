import React from "react";
import {Route, Routes} from "react-router-dom";
import PFDataList from "../pages/PFDataList";
import PFProjectView from "../pages/PFProjectView";
import SqlDiagnosticLayout from "../features/layout-feature/SqlDiagnosticLayout";
import PFViewerLayout from "../features/layout-feature/PFViewerLayout";

function RouterList() {
    return (
        <Routes>
            <Route path="/" element={<PFViewerLayout />}/>
            <Route path="/slowSqlDiagnostic" element={<SqlDiagnosticLayout />}/>
            <Route path="/home" element={<PFProjectView />}/>
            <Route path="/PFViewer" element={<PFViewerLayout />}/>
            <Route path="/PFDataList" element={<PFDataList />}/>
        </Routes>
    );
}

export default RouterList;