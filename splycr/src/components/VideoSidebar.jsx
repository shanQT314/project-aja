import React, {Component} from 'react';
import VideoItem from './VideoItem.jsx';
import '../style/video-sidebar.css';

class VideoSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const allVideos = this.props.videos.filter(vid => {
            // filter out the current video on display
            if (!(vid.owner === this.props.curOwner && vid.name === this.props.curName)) {
                return true;
            }
            return false;
        }).map(item => {
            return (
                <div className="video" key={item.name}>
                    <VideoItem name={item.name} owner={item.owner} date={item.createdAt} thumb={item.link} ></VideoItem>
                </div>
            )
        })
        
        return (
            <div className="videoSidebar column">
                <h6 className="subtitle is-marginless has-text-weight-semibold">Related Videos</h6>
                {allVideos.length > 0 ? <React.Fragment>{allVideos}</React.Fragment> : <div className="section">No Related Videos</div>}
            </div>
        );
    }
}

export default VideoSidebar;