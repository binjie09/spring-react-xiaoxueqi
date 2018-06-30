'use strict';

const ReactDOM = require('react-dom')
import React, { Component } from 'react';
import User from './user'
const follow = require('../follow'); // function to hop multiple links by "rel"
const client = require('../client');
const root = '/api';


export default class RankList extends Component {

    constructor(props) {
        super(props);


        this.state = {users: [], data: [], pagination: {}, loading: false};
        client({method: 'GET', path: '/api/users?sort=solved,desc'}).done(response => {
            this.setState({users: response.entity._embedded.users});
        });
    }
    componentDidMount(){
        console.log("rank did mount")
    }
    render() {
        console.log(this.state.users);
        var users = this.state.users.map(user =>
            <User key={user._links.self.href}
                      user={user}
                    />
        );



        return (

                <table>
                    <tbody>
                    <tr>
                        <th>用户</th>
                        <th>解题数</th>
                        <th>描述</th>

                    </tr>
                    {users}
                    </tbody>
                </table>

        )
    }
    // end::employee-list-render[]
}