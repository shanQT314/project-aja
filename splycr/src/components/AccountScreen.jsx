import React, { Component } from 'react';
import VideoList from '../components/VideoList.jsx';
import '../style/bulma.css';

const empty = {username: null, createdAt: null, bio: null};

class AccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: empty,
            videos: []
        };
    }

    componentDidMount = () => {
        this.getUser();
        this.getUserVideos();
    }

    getUser = () => {      
        fetch(new Request('/api/users/' + this.props.username + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            user => user ? 
                this.setState({ user: user}) : 
                this.setState({ user: empty })
        ) : this.setState({ user: empty }))
        .catch(err => console.log(err));
    }

    getUserVideos = () => {
        // change endpoint if need to display clips or projects, currently sources for easy testing
        fetch(new Request('/api/sources/' + this.props.username + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            videoList => videoList ? 
                this.setState({ videos: videoList }) : 
                this.setState({ videos: [] })
        ) : this.setState({ videos: [] }))
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
        const user = this.state.user;
        let date = this.formatDate(user.createdAt);

        return (
            <div id="accountScreen" className="container section">
                <div className="accountTitle hero">
                    <h1 className="title is-1 is-marginless">{user.username}</h1>
                    <h3>This user was created on {date}</h3>                    
                </div>
                <div className="accountDesc has-top-bottom-border">
                    <h6 className="subtitle is-marginless has-text-weight-semibold">Biography</h6>
                    {user.bio ? <h3>{user.bio}</h3> : <h3>This user does not have a biography yet</h3>}
                </div>
                <VideoList videos={this.state.videos} ></VideoList>
            </div>
        );
    }
}

export default AccountScreen;