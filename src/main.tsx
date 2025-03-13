import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Button, Result } from "antd";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import TablePage from "./pages/MainTable.tsx";
import LoginPage from "./pages/Login.tsx";
import FormPage from "./pages/BloodForm.tsx";
import DailyForm from "./pages/DailyForm.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
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
      </BrowserRouter>
    </StrictMode>
)
