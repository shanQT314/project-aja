import React, {Component} from 'react';
import '../style/button.css';
import '../style/icono.min.css';

class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    render() {
        return (
            <div>
                <button className={"btn"} onClick={this.props.onClick}>
                    <div className={this.props.icon} />
                </button>
            </div>
        );
    }
}

export default Button;