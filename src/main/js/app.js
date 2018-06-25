'use strict';

import Home from "./containers/home";
import CreateDialog from './components/createDialog'
import EmployeeList from './components/employeeList'
import User from "./components/user";
import RankList from "./components/rankList";
import moment from 'moment';
import { DatePicker, version } from 'antd';


const React = require('react');
const ReactDOM = require('react-dom')
const when = require('when');
const client = require('./client');
import { Menu, Icon } from 'antd';
const MenuItemGroup = Menu.ItemGroup;
const SubMenu = Menu.SubMenu;
const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/api';
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
                    <Menu.Item key="mail">
                        <Icon type="mail" />排行榜
                    </Menu.Item>
                    <Menu.Item key="app" disabled>
                        <Icon type="appstore" />举行的比赛
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />Navigation Three - Submenu</span>}>
                        <MenuItemGroup title="Item 1">
                            <Menu.Item key="setting:1">Option 1</Menu.Item>
                            <Menu.Item key="setting:2">Option 2</Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="Item 2">
                            <Menu.Item key="setting:3">Option 3</Menu.Item>
                            <Menu.Item key="setting:4">Option 4</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                    <Menu.Item key="alipay">
                        <a href="#" target="_blank" rel="noopener noreferrer">题库</a>
                    </Menu.Item>
                </Menu>
        );
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {employees: [], attributes: [], pageSize: 2, links: {}, users: []};

        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
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
        client({method: 'GET', path: '/api/users?sort=solved,desc'}).done(response => {
            this.setState({users: response.entity._embedded.users});
        });
    }
    // end::follow-1[]

    render() {

        return (

            <div>
                <Home/>
                <Sider />
                <DatePicker defaultValue={moment()} />
                <RankList users={this.state.users}/>


                {/*<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>*/}
                {/*<EmployeeList employees={this.state.employees}*/}
                              {/*links={this.state.links}*/}
                              {/*pageSize={this.state.pageSize}*/}
                              {/*attributes={this.state.attributes}*/}
                              {/*onNavigate={this.onNavigate}*/}
                              {/*onUpdate={this.onUpdate}*/}
                              {/*onDelete={this.onDelete}*/}
                              {/*updatePageSize={this.updatePageSize}/>*/}
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)