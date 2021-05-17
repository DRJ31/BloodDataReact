import React, { FC, useState, useEffect } from 'react';
import {
    useLocation,
    useHistory,
    Switch,
    Route,
    Link,
} from 'react-router-dom';
import { Layout, Typography, Result, Button, Menu, Dropdown, message } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import './App.css';
import LoginPage from './pages/Login';
import TablePage from './pages/Table';
import FormPage from './pages/Form';
import * as Cookie from "./cookie";

const { Header, Content } = Layout;
const { Title } = Typography;
const whitelist = ["/", "/input"];

const App: FC = () => {
    const { pathname } = useLocation();
    const [show, setShow] = useState(false);
    const history = useHistory();

    useEffect(() => {
        setShow(whitelist.includes(window.location.pathname));
    }, [pathname])
    
    const logout = () => {
        const username: string | null = Cookie.getValue("username");
        if (username) {
            axios.post("/api/logout", { username })
            .then(response => {
                message.success(response.data.message);
                history.push("/login");
            })
            .catch(err => {
                if (err.response && err.response.data.message) {
                    message.error(err.response.data.message);
                }
                history.push("/login");
            })
        }
    }
    
    const menu = (
        <Menu>
          <Menu.Item key="edit" icon={<EditOutlined />}>
            <Link to="/input">编辑</Link>
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
              <Switch>
                  <Route exact path="/login">
                      <LoginPage />
                  </Route>
                  <Route exact path="/">
                      <TablePage />
                  </Route>
                  <Route exact path="/input">
                      <FormPage />
                  </Route>
                  <Route path="*">
                      <Result
                          status="404"
                          title="404 Not Found"
                          subTitle="Sorry, the page you visited does not exist."
                          extra={<Link to="/"><Button type="primary">Back Home</Button></Link>}
                      />
                  </Route>
              </Switch>
            </Content>
        </div>
      );
}
export default App;
