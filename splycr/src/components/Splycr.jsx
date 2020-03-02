import React, { Component } from 'react';
import SourceClipper from './SourceClipper.jsx';
import CompilationEditor from './CompilationEditor.jsx';
import LoginScreen from './LoginScreen.jsx';
import '../style/bulma.css';
//import AccountScreen from './AccountScreen.jsx';

/**
 * Displays either a SourceClipper, a Compilation Editor, or a Login Screen.
 */
class Splycr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null, // SHOULD BE null (or from Cookie)
            view: "login", // SHOULD BE login (just for easy testing)
        };
    }

    componentDidMount = () => {
        let username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, "$1")
        this.authenticate(username || null);
    }

    logout = () => {
        fetch(new Request('/api/signout/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: null
        }))
        .then(response => {
            if (response.ok) this.authenticate(null);
            else response.text().then(msg => console.log(msg));
        }).catch(err => console.log(err));
    };

    authenticate = user => {
        let view = user ? "sources" : "login";
        this.setState({ user: user }, () => this.switchView(view));
    };

    switchView = view => this.setState({ view: view });

    render = () => {
        let views = {
            login: (<LoginScreen
                view={this.state.view}
                onAuthenticate={this.authenticate}
            />),
            sources: (<SourceClipper
                view={this.state.view}
                user={this.state.user}
                onSwitchView={this.switchView}
                onLogout={this.logout}
            />),
            compilations: (<CompilationEditor
                view={this.state.view}
                user={this.state.user}
                onSwitchView={this.switchView}
                onLogout={this.logout}
            />),
        };
        return views[this.state.view];
    };
}

export default Splycr;