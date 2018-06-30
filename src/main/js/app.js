'use strict';

import CreateDialog from './components/createDialog'
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

const getConfirmation = () => {
    // window.confirm('Are you sure?')
}

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

        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.normFile = this.normFile.bind(this);
    }
    normFile (e)  {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    loadFromServerUser(pageSize) {
        follow(client, root, [
            {rel: 'users', params: {size: pageSize}}]
        ).then(userCollection => {
            return client({
                method: 'GET',
                path: userCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                this.links = userCollection.entity._links;
                return userCollection;
            });
        }).then(userCollection => {
            return userCollection.entity._embedded.users.map(user =>
                client({
                    method: 'GET',
                    path: user._links.self.href
                })
            );
        }).then(userPromises => {
            return when.all(userPromises);
        }).done(users => {
            this.setState({
                users: users,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: this.links
            });
        });
    }

    // tag::follow-2[]
    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'employees', params: {size: pageSize}}]
        ).then(employeeCollection => {
            return client({
                method: 'GET',
                path: employeeCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                this.links = employeeCollection.entity._links;
                return employeeCollection;
            });
        }).then(employeeCollection => {
            return employeeCollection.entity._embedded.employees.map(employee =>
                client({
                    method: 'GET',
                    path: employee._links.self.href
                })
            );
        }).then(employeePromises => {
            return when.all(employeePromises);
        }).done(employees => {
            this.setState({
                employees: employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: this.links
            });
        });
    }
    // end::follow-2[]

    // tag::create[]
    onCreate(newEmployee) {
        var self = this;
        follow(client, root, ['employees']).then(response => {
            return client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: newEmployee,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {
            return follow(client, root, [{rel: 'employees', params: {'size': self.state.pageSize}}]);
        }).done(response => {
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }
    // end::create[]

    // tag::update[]
    onUpdate(employee, updatedEmployee) {
        client({
            method: 'PUT',
            path: employee.entity._links.self.href,
            entity: updatedEmployee,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': employee.headers.Etag
            }
        }).done(response => {
            this.loadFromServer(this.state.pageSize);
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    employee.entity._links.self.href + '. Your copy is stale.');
            }
        });
    }
    // end::update[]

    // tag::delete[]
    onDelete(employee) {
        client({method: 'DELETE', path: employee.entity._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize);
        });
    }
    // end::delete[]

    // tag::navigate[]
    onNavigate(navUri) {
        client({
            method: 'GET',
            path: navUri
        }).then(employeeCollection => {
            this.links = employeeCollection.entity._links;

            return employeeCollection.entity._embedded.employees.map(employee =>
                client({
                    method: 'GET',
                    path: employee._links.self.href
                })
            );
        }).then(employeePromises => {
            return when.all(employeePromises);
        }).done(employees => {
            this.setState({
                employees: employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: this.state.pageSize,
                links: this.links
            });
        });
    }
    // end::navigate[]

    // tag::update-page-size[]
    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }
    // end::update-page-size[]

    // tag::follow-1[]
    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
       // this.loadFromServerUser(this.state.pageSize);

    }
    // end::follow-1[]

    render() {

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (

            <div>


                <BrowserRouter basename="/">
                    <div>
                         <Sider />
                         <Route exact path="/ranklist" component={RankList} />
                    </div>
                </BrowserRouter>

                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
                <HyperStatusList employees={this.state.employees}
                              links={this.state.links}
                              pageSize={this.state.pageSize}
                              attributes={this.state.attributes}
                              onNavigate={this.onNavigate}
                              onUpdate={this.onUpdate}
                              onDelete={this.onDelete}
                              updatePageSize={this.updatePageSize}/>

            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)