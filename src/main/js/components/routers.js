import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Reducer from './reducers';
import hyperStatusList from './hyperStatusList';
import rankList from './rankList';
import './fontIcon/index.css';
const Store = createStore(Reducer)
const Root = () => (
    <BrowserRouter>
        <Provider store={Store}>
            <div>
                <Switch>
                    <Route exact path="/" component={hyperStatusList}/>
                    <Route path="/home" component={rankList}/>
                    <Redirect to="/"/>
                </Switch>
            </div>
        </Provider>
    </BrowserRouter>
);

const dom = document.getElementById('root');

ReactDOM.render(<Root />, dom);