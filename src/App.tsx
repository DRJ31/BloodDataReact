import React, { FC, useState, useEffect } from 'react';
import {
    useLocation,
    useNavigate,
    Outlet,
    Link,
} from 'react-router-dom';
import { Layout, Typography, Dropdown, message, MenuProps } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';
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
    
    // const menu = (
    //     <Menu>
    //         <Menu.Item key="add" icon={<PlusOutlined />}>
    //             <Link to="/input/daily">添加日常数据</Link>
    //         </Menu.Item>
    //       <Menu.Item key="edit" icon={<EditOutlined />}>
    //         <Link to="/input/blood">血常规数据编辑</Link>
    //       </Menu.Item>
    //       <Menu.Item key="logout" icon={<LogoutOutlined />}>
    //         <span onClick={logout}>退出</span>
    //       </Menu.Item>
    //     </Menu>
    // );
    const items: MenuProps['items'] = [
        { label: <Link to="/input/daily">添加日常数据</Link>, key: "add", icon: <PlusOutlined /> },
        { label: <Link to="/input/blood">血常规数据编辑</Link>, key: "edit", icon: <EditOutlined /> },
        { label: <span onClick={logout}>退出</span>, key: "logout", icon: <LogoutOutlined /> },
    ]

    return (
        <div className="app">
            <Header>
                <Title style={{ lineHeight: "2.7em", background: "#1677ff", paddingLeft: "2em" }} level={3}>
                  <Link to="/" style={{ color: "white" }}>Blood Data</Link>
                </Title>
                {show && <Dropdown menu={{ items }} trigger={['click', 'hover']}>
                    <div style={{ fontSize: "1.5em", color: "white", float: "right" }}>
                        <UserOutlined /> <DownOutlined />
                    </div>
                </Dropdown>}
            </Header>
            <Content style={{ padding: "1.5em", paddingTop: "1em", textAlign: "center" }}>
              <Outlet/>
            </Content>
        </div>
      );
}
export default App;
