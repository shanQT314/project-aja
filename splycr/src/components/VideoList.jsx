import React, { Component } from 'react';
import VideoItem from '../components/VideoItem.jsx'

class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const allVideos = this.props.videos.map(item => {
            return (
                <div className="video column is-one-quarter" key={item.name}>
                    <VideoItem name={item.name} date={item.createdAt} thumb={item.link}></VideoItem>
                </div>
            )
        })

        return (
            <div className="actualVideoList columns is-multiline">
                {allVideos.length > 0 ? <React.Fragment>{allVideos}</React.Fragment> : <div className="section">No Videos</div>}
            </div>
        );
    }
}

export default VideoList;