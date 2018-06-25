'use strict';

const ReactDOM = require('react-dom')
import React, { Component } from 'react';
import User from './user'
const follow = require('../follow'); // function to hop multiple links by "rel"

const root = '/api';


export default class RankList extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        var users = this.props.users.map(user =>
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