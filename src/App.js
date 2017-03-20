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

    renderGithubStar() {
        return <div>
            <a className="github-button"
               href="https://github.com/ohlsont/json-flow"
               data-style="mega" data-count-href="/ohlsont/json-flow/stargazers"
               data-count-api="/repos/ohlsont/json-flow#stargazers_count"
               data-count-aria-label="# stargazers on GitHub" aria-label="Star ohlsont/json-flow on GitHub"
            >
                Star
            </a>
            <a href="https://github.com/ohlsont/json-flow">
                <img style={{ position: 'absolute', top: 0, right: 0, border: 0 }}
                     src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67"
                     alt="Fork me on GitHub"
                     data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"
                />
            </a>
        </div>
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
                        {this.renderGithubStar()}
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
