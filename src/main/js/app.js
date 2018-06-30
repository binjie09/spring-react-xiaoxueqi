'use strict';


import HyperStatusList from './components/hyperStatusList'
import Home from './containers/home'
const React = require('react');
const ReactDOM = require('react-dom')
const when = require('when');
const client = require('./client');
import {BrowserRouter, Route, Link} from 'react-router-dom';
import { Menu, Icon, Form, Input, Button, Radio,Select } from 'antd';
import RankList from "./components/rankList";
const FormItem = Form.Item;
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
const follow = require('./follow'); // function to hop multiple links by "rel"
const root = '/api';


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit (e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                    validateStatus={userNameError ? 'error' : ''}
                    help={userNameError || ''}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={passwordError ? 'error' : ''}
                    help={passwordError || ''}
                >
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your Password!' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                    >
                        Log in
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm);

class Sider extends React.Component {
    constructor(props) {
        super(props); // you always need to call super();

        this.state =
        {
                current: 'mail',
        }

        this.handleClick=this.handleClick.bind(this)

    }



    handleClick  (e)  {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="index">
                        首页
                        <Link to='/'> </Link>
                    </Menu.Item>
                    <Menu.Item key="mail">
                         <Icon type="mail" />
                        排行榜
                        <Link to='/ranklist'> </Link>
                    </Menu.Item>
                    <Menu.Item key="app" disabled>
                        <Icon type="appstore" />举行的比赛
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />管理</span>}>
                        <MenuItemGroup title="Item 1">
                            <Menu.Item key="setting:1">添加题目数据</Menu.Item>
                            <Menu.Item key="setting:2">管理员设置
                                <Link to='/'> </Link>
                            </Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="Item 2">
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </MenuItemGroup>

                    </SubMenu>
                    <Menu.Item key="alipay">
                        题库
                    </Menu.Item>
                    <WrappedHorizontalLoginForm />

                </Menu>

        );
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {employees: [], attributes: [], pageSize: 20, links: {}, users: []};


    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <BrowserRouter basename="/">
                    <div>
                         <Sider />
                        <Route exact path="/ranklist" component={RankList} />
                        <Route exact path="/" component={HyperStatusList} />
                    </div>
                </BrowserRouter>

            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)