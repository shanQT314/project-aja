import React, {Component} from 'react';
import '../style/form.css';
import Button from './Button.jsx';
import TimeIndexEditBox from './TimeIndexEditBox';

class EffectsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            effect: "",
            start: 0,
            stop: 0
        };
    }

    updateEffect = (event) => this.setState({effect: event.target.value});

    submit = (event) => {
        event.preventDefault();
        this.props.onEffectSubmit(this.state);
        this.setState({
            effect: "",
            start: 0,
            stop: 0
        });
    };

    render() {
        return (
            <div className="add-form">
                <form>
                    <select 
                        className="form-element"
                        value={this.state.effect}
                        name="effect"
                        onChange={this.updateEffect}
                    >
                        <option value={""}>None</option>
                        <option value={"firstEffect"}>First Effect</option>
                    </select>
                    <TimeIndexEditBox 
                        label="Start"
                        edit={true}
                        timeIndex={this.state.start}
                        onIndexUpdate={(index) => this.setState({ start: index })}
                    />
                    <TimeIndexEditBox
                        label="Stop"
                        edit={true}
                        timeIndex={this.state.stop}
                        onIndexUpdate={(index) => this.setState({ stop: index })}
                    />
                    <Button 
                        icon="icono-check"
                        className="form-element"
                        onClick={this.submit}
                    />
                </form>
            </div>
        );
    }
}

export default EffectsForm;