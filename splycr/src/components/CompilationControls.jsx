import React, {Component} from 'react';
import Button from './Button.jsx';

class CompilationControls extends Component {

    fieldUpdate = (event) => this.props[event.target.name + "Update"](event.target.value);

    render = ()  => {
        return (
            <div className="boxed row">
                <select 
                    value={this.props.codec} 
                    name="codec"
                    onChange={this.fieldUpdate}
                >
                    <option value="ffmpeg">FFMpeg</option>
                    <option value="h.264">H.264</option>
                </select>
                <select 
                    value={this.props.container}
                    name="container"
                    onChange={this.fieldUpdate}
                >
                    <option value="mp4">MP4</option>
                    <option value="avi">AVI</option>
                </select>
                <Button 
                    icon="icono-downArrow"
                    onClick={() => this.props.onCompile()}
                />
            </div>
        );
    }

}

export default CompilationControls;