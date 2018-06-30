'use strict';

const ReactDOM = require('react-dom')
import React, { Component } from 'react';
import Employee from './employee'
import CreateDialog from './createDialog'
const follow = require('../follow'); // function to hop multiple links by "rel"
const root = '/api';
const when = require('when');
const client = require('../client')

export default class HyperStatusList extends Component {

    constructor(props) {
        super(props);
        this.state = {employees: [], attributes: [], pageSize: 5, links: {}};
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
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



    // tag::handle-page-size-updates[]
    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
        }
    }
    // end::handle-page-size-updates[]

    // tag::handle-nav[]
    handleNavFirst(e){
        e.preventDefault();
        this.onNavigate(this.state.links.first.href);
    }
    handleNavPrev(e) {
        e.preventDefault();
        this.onNavigate(this.state.links.prev.href);
    }
    handleNavNext(e) {
        e.preventDefault();
        this.onNavigate(this.state.links.next.href);
    }
    handleNavLast(e) {
        e.preventDefault();
        this.onNavigate(this.state.links.last.href);
    }
    // end::handle-nav[]
    // tag::employee-list-render[]
    // tag::follow-1[]
    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
        // this.loadFromServerUser(this.state.pageSize);

    }
    // end::follow-1[]
    render() {
        var employees = this.state.employees.map(employee =>
            <Employee key={employee.entity._links.self.href}
                      employee={employee}
                      attributes={this.state.attributes}
                      onUpdate={this.onUpdate}
                      onDelete={this.onDelete}/>
        );

        var navLinks = [];

        if ("first" in this.state.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>第一页</button>);
        }
        if ("prev" in this.state.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>上一页</button>);
           // curpages = this.state.links.prev ;
        }
        if ("next" in this.state.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>下一页</button>);

        }
        if ("last" in this.state.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>最后一页</button>);
        }

        return (
            <div>
                <input ref="pageSize" defaultValue={this.state.pageSize} onInput={this.handleInput}/>
                <table>
                    <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Description</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {employees}
                    </tbody>
                </table>
                <div>
                    {navLinks}


                </div>
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
            </div>
        )
    }
    // end::employee-list-render[]
}