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
        json: '{ "name":"John", "age":31, "city":"New York" }',
        loading: false,
        errorString: null,
    };

    isURL(str) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
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

    async getJson(url) {
        const loading = false;
        const errorString = 'bad response from remote source'
        this.setState({
            errorString,
            loading
        })
        try {
            const resp = await fetch(url);

            if (!resp.ok) {
                console.error('invalid url ', url, resp);
                this.setState({
                    errorString,
                    loading
                })
                return
            }
            const json = await resp.json();
            this.setState({
                json: JSON.stringify(json),
                errorString: null,
                loading
            })
        } catch (error) {
            this.setState({
                errorString,
                loading
            })
        }
    }

    isValid(str) {
        return this.isJsonString(str) || this.isURL(str)
    }

    render() {
        const { json, loading, errorString } = this.state;
        const ex = `{ "name":"John", "age":31, "city":"New York" } or https://happy.kitten.furr`;
        return (
            <MuiThemeProvider>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2>JSON -> FlowType</h2>
                        <h3>Paste valid json or url to json and get a flow type object</h3>
                    </div>
                    <TextField
                        style={{ textAlign: 'left', width: '40em' }}
                        hintText={ex}
                        disabled={loading}
                        errorText={errorString}
                        floatingLabelText="Insert json or url here"
                        onChange={(e, value) => {
                            if (this.isURL(value)) {
                                return this.getJson(value)
                            }
                            const state = {
                                json: value,
                                errorString: null,
                            }
                            if (!this.isJsonString(value)) {
                                state.errorString = 'invalid json string'
                            }
                            this.setState(state)
                        }}
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
