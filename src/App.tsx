import React, { FC } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom';
import { Layout, Typography, Result, Button } from 'antd';
import './App.css';
import LoginPage from './pages/Login';
import TablePage from './pages/Table';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: FC = () => (
  <div className="App">
      <Header style={{ textAlign: "left" }}>
          <Title style={{ color: "white", lineHeight: "2em" }} level={2}>Blood Data</Title>
      </Header>
      <Content style={{ padding: "2em" }}>
          <Router>
            <Switch>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route exact path="/">
                    <TablePage />
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
          </Router>
      </Content>
  </div>
);
export default App;
