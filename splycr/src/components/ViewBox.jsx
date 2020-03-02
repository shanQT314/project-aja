import React, { Component } from 'react';
import '../style/view-box.css';
import ReactPlayer from 'react-player';

class ViewBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clip: null,
            playing: false
        };
        this.player = new React.createRef();
    }

    setClip = clip => {
        this.player.current.seekTo(clip.startTime);
        this.setState({ clip: clip }, () => this.setState({ playing: true }));
    };

    onProgress = progress => {
        if (this.state.clip && progress.played * this.props.videoDuration > this.state.clip.stopTime)
            this.setState({ playing: false });
    };

    render() {
        let video = this.props.video;
        return (
            <div className="view-box">
                {!video.owner || !video.name ? null :
                    <ReactPlayer
                        ref={this.player}
                        progressInterval={16}
                        playing={this.state.playing}
                        className="video"
                        width="100%"
                        controls
                        onProgress={this.onProgress}
                        onDuration={this.props.setDuration}
                        url={'/api/sources/' + video.owner + '/' + video.name + '/source'}
                    />}
            </div>
        );
    }
}

export default ViewBox;