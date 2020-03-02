import React, { Component } from 'react';
import ClipEditBox from './ClipEditBox.jsx';
import CompilationControls from './CompilationControls.jsx';

class ClipsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clips: props.clips || []
        };
    }

    componentDidMount() {
        this.updateClips();
    } 

    updateClips = () => {
        if (this.props.video.owner === null) return;
        fetch(new Request(
            '/api/clips/' + this.props.video.owner + '/' + this.props.video.name + '/'),
            { method : 'GET' })
        .then(response => {
            if (response.ok) response.json().then(clips => this.setState({ clips: clips }));
            else console.log(response);
        })
    };

    makeClip = (clip) => {
        return (<ClipEditBox
            id={clip._id}
            key={clip._id}
            videoid={clip.videoid}
            videoLength={this.props.video}
            owner={clip.owner}
            startTime={clip.startTime}
            stopTime={clip.stopTime}
            tags={clip.tags}
            onClipsUpdate={this.updateClips}
            onView={this.props.onDisplay}
        />)
    }

    render() {
        return (
            <div className="section">
                {this.props.view !== "sources" ? null :
                    <ClipEditBox 
                        top={true} 
                        onClipsUpdate={this.updateClips}
                        videoid={this.props.video.name}
                        videoDuration={this.props.videoDuration}
                        owner={this.props.video.owner} 
                        onView={this.props.onDisplay}
                    />}
                {this.props.view !== "compilations" || this.props.video.owner == null ? null :
                    <CompilationControls 
                        onCompile={this.props.compileVideo} 
                        container={this.props.outputContainer}
                        containerUpdate={this.props.containerUpdate}
                        codec={this.props.outputCodec}
                        codecUpdate={this.props.codecUpdate}
                    />}
                {this.state.clips.map(this.makeClip)}
            </div>
        );
    }
}

export default ClipsBox;