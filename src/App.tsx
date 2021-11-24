import React, { FC, useState, useEffect } from 'react';
import {
    useLocation,
    useNavigate,
    Routes,
    Route,
    Link,
} from 'react-router-dom';
import { Layout, Typography, Result, Button, Menu, Dropdown, message } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';
import LoginPage from './pages/Login';
import TablePage from './pages/MainTable';
import FormPage from './pages/BloodForm';
import DailyForm from "./pages/DailyForm";
import * as Cookie from "./cookie";

const { Header, Content } = Layout;
const { Title } = Typography;
const whitelist = ["/", "/input/blood", "/input/daily"];

const App: FC = () => {
    const { pathname } = useLocation();
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setShow(whitelist.includes(window.location.pathname));
    }, [pathname])
    
    const logout = () => {
        const username: string | null = Cookie.getValue("username");
        if (username) {
            axios.post("/api/logout", { username })
            .then(response => {
                message.success(response.data.message);
                navigate("/login");
            })
            .catch(err => {
                if (err.response && err.response.data.message) {
                    message.error(err.response.data.message);
                }
                navigate("/login");
            })
        }
    }
    
    const menu = (
        <Menu>
            <Menu.Item key="add" icon={<PlusOutlined />}>
                <Link to="/input/daily">添加日常数据</Link>
            </Menu.Item>
          <Menu.Item key="edit" icon={<EditOutlined />}>
            <Link to="/input/blood">血常规数据编辑</Link>
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            <span onClick={logout}>退出</span>
          </Menu.Item>
        </Menu>
    );

    return (
        <div className="app">
            <Header>
                <Title style={{ lineHeight: "2.7em", float: "left" }} level={3}>
                  <Link to="/" style={{ color: "white" }}>Blood Data</Link>
                </Title>
                {show && <Dropdown overlay={menu} trigger={['click', 'hover']}>
                    <div style={{ fontSize: "1.5em", color: "white", float: "right" }}>
                        <UserOutlined /> <DownOutlined />
                    </div>
                </Dropdown>}
            </Header>
            <Content style={{ padding: "1.5em", paddingTop: "1em", textAlign: "center" }}>
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<TablePage />} />
                  <Route path="/input/blood" element={<FormPage />} />
                  <Route path="/input/daily" element={<DailyForm />} />
                  <Route
                      path="*"
                      element={<Result
                          status="404"
                          title="404 Not Found"
                          subTitle="Sorry, the page you visited does not exist."
                          extra={<Link to="/"><Button type="primary">返回主页</Button></Link>}
                      />}
                  />
              </Routes>
            </Content>
        </div>
      );
}
export default App;
