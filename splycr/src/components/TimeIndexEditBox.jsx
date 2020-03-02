import React, {Component} from 'react';
import Button from './Button.jsx';
import '../style/time-index-display.css'

class TimeIndexEditBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onIndexUpdate = props.onIndexUpdate;
    }

    incrementBig = event => {
        event.preventDefault();
        this.onIndexUpdate(this.props.timeIndex + 60);
    };

    decrementBig = event => {
        event.preventDefault();
        this.onIndexUpdate(this.props.timeIndex - 60);
    }

    increment = event => {
        event.preventDefault();
        this.onIndexUpdate(this.props.timeIndex + 1);
    };

    decrement = event => {
        event.preventDefault();
        this.onIndexUpdate(this.props.timeIndex - 1);
    }

    incrementSmall = event => {
        event.preventDefault();
        this.onIndexUpdate(this.props.timeIndex + 0.01);
    };

    decrementSmall = event => {
        event.preventDefault();
        this.onIndexUpdate(this.props.timeIndex - 0.01);
    }

    timeDisplay = time => {
        let format = time => ("00" + Math.floor(time)).slice(-2);
        return `${format(time / 60)}:${format(time % 60)}:${format((time % 1) * 100)}`;
    }

    render() {
        return (
            <div className="time-index-display">
                <div>{this.props.label}: {this.timeDisplay(this.props.timeIndex)}</div>
                <div className="time-index-adjustment">
                {this.props.edit ? (
                <div>
                    <Button 
                        icon="icono-caretUp" 
                        onClick={this.incrementBig}
                    />
                    <Button 
                        icon="icono-caretDown"
                        onClick={this.decrementBig}
                    />
                </div> ) : null}
                {this.props.edit ? (
                <div>
                    <Button 
                        icon="icono-caretUpSquare" 
                        onClick={this.increment}
                    />
                    <Button 
                        icon="icono-caretDownSquare"
                        onClick={this.decrement}
                    />
                </div> ) : null}
                {this.props.edit ? (
                <div>
                    <Button 
                        icon="icono-caretUpCircle" 
                        onClick={this.incrementSmall}
                    />
                    <Button 
                        icon="icono-caretDownCircle"
                        onClick={this.decrementSmall}
                    />
                </div> ) : null}
                </div>
            </div>
        );
    }
}

export default TimeIndexEditBox;