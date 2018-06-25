'use strict';

import React, { Component } from 'react';


export default class User extends Component {

    constructor(props) {
        super(props);

    }


    render() {

        return (
            <tr>
                <td>{this.props.user.email}</td>
                <td>{this.props.user.solved}</td>
                <td>{this.props.user.nick}</td>

            </tr>
        )
    }
}
// end::employee[]