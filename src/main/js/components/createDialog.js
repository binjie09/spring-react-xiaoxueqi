'use strict';

const ReactDOM = require('react-dom')
import React, { Component } from 'react';

const follow = require('../follow'); // function to hop multiple links by "rel"

const root = '/api';

// tag::create-dialog[]
export default class CreateDialog extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var newEmployee = {};
        this.props.attributes.forEach(attribute => {
            newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newEmployee);
        this.props.attributes.forEach(attribute => {
            ReactDOM.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
        });
        window.location = "#";
    }

    render() {
        var inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );
        return (
            <div>
                <a href="#createEmployee">Create a admin</a>

                <div id="createEmployee" className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new admin</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Createeeeeeeee</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
};
// end::create-dialog[]