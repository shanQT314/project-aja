import React, {Component} from 'react';
import ReactPlayer from 'react-player';
import VideoSidebar from './VideoSidebar.jsx';
import '../style/sharedvideo.css';

const empty = {owner: null, title: null, creationDate: null, desc: null};

class SharedVideo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: true,
            video: empty,
            relatedVideos: []
        };
    }

    componentDidMount = () => {
        this.getVideo();
        this.getRelatedVideos();
    }

    getVideo = () => {
        // change endpoint if need to display clips or projects, currently set to sources for easy testing
        fetch(new Request('/api/sources/' + this.props.username + '/' + this.props.videoname + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            video => video.length > 0 ? 
                this.setState({ video: video[0] }) : 
                this.setState({ video: empty })
        ) : this.setState({ video: empty }))
        .catch(err => console.log(err));
    }

    getRelatedVideos = () => {
        // should set relatedVideos to a list of related videos by tags
        fetch(new Request('/api/sources/' + this.props.username + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            videoList => videoList ? 
                this.setState({ relatedVideos: videoList }) : 
                this.setState({ relatedVideos: [] })
        ) : this.setState({ relatedVideos: [] }))
        .catch(err => console.log(err));
    }

    formatDate = (dateToFormat) => {
        let dateItem = new Date(dateToFormat);
        let day = dateItem.getDate() < 10 ? '0' + dateItem.getDate() : dateItem.getDate();
        let month = (dateItem.getMonth() + 1) < 10 ? '0' + (dateItem.getMonth() + 1) : (dateItem.getMonth() + 1);
        let date = month + '/' + day + '/' + dateItem.getFullYear();
        return date;
    }

    render() {
        const video = this.state.video;
        let date = this.formatDate(video.createdAt);

        return (
            <div className="SharedVideoScreen columns section">
                <VideoSidebar videos={this.state.relatedVideos} curName={video.name} curOwner={video.owner} />
                <div className="sharedVideo column is-four-fifths">
                    <div className="videoBox">
                        <ReactPlayer
                            progressInterval={16}
                            playing={this.state.playing}
                            className="video"
                            width="100%"
                            height="100%"
                            url={'/api/sources/' + video.owner + '/' + video.name + '/source'}
                            controls
                        />
                    </div>
                    <div className="video-meta">
                        <div className="videoTitle section">
                            <h1 className="title is-3 is-marginless">{video.name}</h1>
                            <h3>This video was created on {date}</h3>
                            <div className="vidDesc has-top-bottom-border">
                                <h6 className="subtitle is-5 is-marginless has-text-weight-semibold">{video.owner}</h6>
                                {video.desc ? <h3>{video.desc}</h3> : <h3>This video has no description</h3>}
                            </div>                    
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

export default SharedVideo;