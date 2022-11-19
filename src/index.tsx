import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import LoginPage from "./pages/Login";
import TablePage from "./pages/MainTable";
import FormPage from "./pages/BloodForm";
import DailyForm from "./pages/DailyForm";
import { Button, Result } from "antd";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
  <Router>
      <Routes>
          <Route path="/" element={<App/>}>
              <Route index element={<TablePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="input">
                  <Route path="blood" element={<FormPage />} />
                  <Route path="daily" element={<DailyForm />} />
              </Route>
              <Route
                  path="*"
                  element={<Result
                      status="404"
                      title="404 Not Found"
                      subTitle="Sorry, the page you visited does not exist."
                      extra={<Link to="/"><Button type="primary">返回主页</Button></Link>}
                  />}
              />
          </Route>

      </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
