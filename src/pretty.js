import React from 'react'

export default class Pretty extends React.Component {
    style = {
        backgroundColor: '#1f4662',
        color: '#fff',
        fontSize: '12px',
        width: '40em',
    }

    headerStyle = {
        backgroundColor: '#193549',
        padding: '5px 10px',
        fontFamily: 'monospace',
        color: '#ffc600',
    }

    preStyle = {
        display: 'block',
        padding: '10px 30px',
        margin: '0',
        overflow: 'scroll',
        textAlign: 'left',
    }

    state = {
        show: true,
    }

    toggle() {
        this.setState({
            show: !this.state.show,
        });
    }

    render() {
        return (
            <div style={this.style}>
                <div style={this.headerStyle} onClick={ this.toggle }>
                    <strong>Flow</strong>
                </div>
                {( this.state.show ?
                    <pre style={this.preStyle}>
                        {this.props.data}
                    </pre> : false )}
            </div>
        )
    }
}