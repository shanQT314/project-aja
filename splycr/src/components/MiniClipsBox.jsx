import React, { Component } from 'react';
import MiniClipViewBox from './MiniClipViewBox.jsx';

class MiniClipsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clips: props.clips || []
        };
    }

    makeClip = (clip) => {
        return (<MiniClipViewBox
            id={clip._id}
            key={clip._id}
            videoid={clip.videoid}
            owner={clip.owner}
            startTime={clip.startTime}
            stopTime={clip.stopTime}
            tags={clip.tags}
            onIncludeClip={this.props.onIncludeClip}
        />)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.clips.map(this.makeClip)}
            </React.Fragment>
        );
    }
}

export default MiniClipsBox;