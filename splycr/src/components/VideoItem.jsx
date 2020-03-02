import React, { Component } from 'react';
import '../style/video-item.css';

class VideoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name ? props.name : null,
            owner: props.owner ? props.owner : null,
            thumb: props.thumb ? props.thumb : null,
            date: null
        };
    }

    componentDidMount = () => {
        this.props.date ? this.formatDate(this.props.date) : this.setState({ date: null });
    }

    formatDate = (dateToFormat) => {
        let dateItem = new Date(dateToFormat);
        let day = dateItem.getDate() < 10 ? '0' + dateItem.getDate() : dateItem.getDate();
        let month = (dateItem.getMonth() + 1) < 10 ? '0' + (dateItem.getMonth() + 1) : (dateItem.getMonth() + 1);
        let date = month + '/' + day + '/' + dateItem.getFullYear();
        this.setState({ date: date });
    }

    render() {
        return (
            <div className="video-item card">
                <div className="thumbnail has-background-light card-image is-horizontal-centered">
                    <img src={this.state.thumb} className="video_image" alt="vid_thumbnail"></img>
                </div>
                <div className="card-content">
                    <h5 className="subtitle is-5 is-marginless has-text-weight-semibold">{this.state.name}</h5>
                    <h6 className="subtitle is-7 is-marginless has-text-weight-semibold">{this.state.owner}</h6>
                    <p className="has-text-grey is-size-7 is-marginless">{this.state.date}</p>
                </div>
            </div>
        );
    }
}

export default VideoItem;