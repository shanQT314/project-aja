import React, {Component} from 'react';
import '../style/login-screen.css';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: "Sign In",
            user: "",
            password: "",
            password2: "",
            bio: "",
            valid: false,
            error: Error("Please input your credentials")
        };
    }

    validate = () => {
        let s = this.state;
        if (s.user.length < 3)
            this.handleError(Error("Username must have at least 3 characters"));
        else if (s.password.length < 5) 
            this.handleError(Error("Password must have at least 5 characters"));
        else if (s.mode === 'Sign Up' && s.password !== s.password2)
            this.handleError(Error("Passwords must match"));
        else
            this.setState({ valid: true });
    }

    handleError = (err) => {
        this.setState({
            valid: false,
            error: err
        });
    }

    onUpdate = (event) => {
        let newState = {}
        newState[event.target.name] = event.target.value;
        this.setState(newState, this.validate);
    }

    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.valid) {
            fetch(new Request('/api/users/', {
                method: this.state.mode === 'Sign Up' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.user,
                    password: this.state.password,
                    bio: this.state.bio
                })
            }))
            .then(response => {
                if (response.ok) this.props.onAuthenticate(this.state.user);
                else response.text().then(msg => this.handleError(new Error(msg)));
            }).catch(err => this.handleError(new Error(err)));
        }
    };
    
    render() {
        return (
            <div className="login has-text-centered">
                <h2 className="title">Welcome to Splycr</h2>
                <form className="login-form">
                    {this.state.valid ? null : <output className="has-text-grey is-size-7">{this.state.error.message}</output>}
                    <div className="inputFields">
                        <input className="field input" placeholder="User Name" name="user" onChange={this.onUpdate}/>
                        <input className="field input" type="password" placeholder="Password" name="password" onChange={this.onUpdate}/>
                        {this.state.mode === "Sign In" ? null :
                            <React.Fragment>
                                <input className="field input" type="password" placeholder="Retype Password" name="password2" onChange={this.onUpdate}/>
                                <textarea className="textarea input field" type="textarea" placeholder="Tell us about yourself (optional)" name="bio" onChange={this.onUpdate}></textarea>
                            </React.Fragment>
                        }
                    </div>
                    <input 
                        className="loginBtn button is-link is-fullwidth"
                        type="button" 
                        value={this.state.mode} 
                        onClick={this.onSubmit}
                        disabled={!this.state.valid}
                    />
                    <label className="has-text-centered">{this.state.mode === "Sign In" ? "Need" : "Have"} an account?
                    <input 
                        className="mode"
                        type="button" 
                        name="mode"
                        value={this.state.mode === "Sign In" ? "Sign Up" : "Sign In"}
                        onClick={this.onUpdate} 
                    />
                    </label>
                </form>
            </div>
        );
    }
}

export default LoginScreen;