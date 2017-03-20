import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { TextField } from 'material-ui';
import flow from './flow'
import Pretty from './pretty'

import logo from './logo.svg';
import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

class App extends Component {
    state = {
        json: ' { "name":"John", "age":31, "city":"New York" }'
    }

    isJsonString(str) {
        console.log('debug ', str)
        try {
            JSON.parse(str);
        } catch (e) {
            console.error('bad json')
            return false;
        }
        return true;
    }

    render() {
        const { json } = this.state;
        const ex = `{ "someNumber": 5 }`;
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2>JSON -> FlowType</h2>
                        <h3>Paste valid json and get a flow type object</h3>
                    </div>
                    <TextField
                        style={{ textAlign: 'left', width: '40em' }}
                        hintText={ex}
                        errorText={!this.isJsonString(json) && 'invalid json'}
                        floatingLabelText="Insert json here"
                        onChange={(e, value) => this.setState({ json: value })}
                        multiLine={true}
                        fullWidth={true}
                        rows={5}
                    />
                    <p>Convert from JSON above to Flow types below</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {this.isJsonString(json) && <Pretty data={flow(JSON.parse(json))} />}
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
