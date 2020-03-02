import React, { Component } from 'react';
import TimeIndexEditBox from './TimeIndexEditBox.jsx';
import Button from './Button.jsx';
import TagEditBox from './TagEditBox.jsx';
import '../style/tag.css';

class MiniClipViewBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id || null,
            videoid: props.videoid || null,
            edit: props.top || false,
            owner: props.owner || null,
            startTime: props.startTime || 0,
            stopTime: props.stopTime || 0,
            tags: props.tags || [],
        };
    }

    render() {
        return (
            <div className="boxed">
                <div className="row">
                    <TimeIndexEditBox
                        label="Start"
                        edit={false}
                        timeIndex={this.state.startTime}
                    />
                    <TimeIndexEditBox
                        label="End"
                        edit={false}
                        timeIndex={this.state.stopTime}
                    />
                </div>
                <div className="row">
                    <TagEditBox
                        edit={false}
                        tags={this.state.tags}
                        onTagsUpdate={(tags) => this.setState({ tags: tags })}
                    />
                    {<Button 
                        icon="icono-check" 
                        onClick={() => this.props.onIncludeClip(this.state.id)} 
                    />}
                </div>
            </div>
        );
    }
}

export default MiniClipViewBox;