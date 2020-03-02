import React, {Component} from 'react';
import NavBar from './NavBar.jsx';
import ClipsBox from './ClipsBox.jsx';
import ViewBox from './ViewBox.jsx';
import SearchForm from './SearchForm.jsx';
import AddForm from './AddForm.jsx';

const empty = {owner: null, name: "No Sources"}

class SourceClipper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            video: empty,
            showSearchForm: false,
            showAddForm: false,
            currentTime: 5
        };
        this.playerRef = new React.createRef();
    }

    goToClip = clip => this.playerRef.current.setClip(clip);

    componentDidMount = () => {
        this.getFirstVideo();
    }

    getFirstVideo = () => {      
        fetch(new Request('/api/sources/' + this.props.user + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            sources => sources.length > 0 ? 
                this.setState({ video: sources[0] }) : 
                this.setState({ video: empty })
        ) : this.setState({ video: empty }))
        .catch(err => console.log(err));
    }

    isOwner = () => this.state.video.owner != null || this.state.video.owner === this.props.user;

    toggleSearchForm = () => {
        this.setState(state => ({
            showAddForm: false,
            showSearchForm: !state.showSearchForm
        }));
    }

    toggleAddForm = () => {
        this.setState(state => ({
            showSearchForm: false,
            showAddForm: !state.showAddForm
        }));
    }

    next = () => {
        fetch(new Request('/api/sources/' + this.props.user + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            sources => {
                let idx = sources.map(s => s.name).indexOf(this.state.video.name);
                if (idx !== -1) this.setState(state => ({ video: sources[idx + 1] || state.video }))
            }
        ) : this.setState({ video: empty }))
        .catch(err => console.log(err));
    };

    prev = () => {
        fetch(new Request('/api/sources/' + this.props.user + '/'), { method: 'GET' })
        .then(response => response.ok ? response.json().then(
            sources => {
                let idx = sources.map(s => s.name).indexOf(this.state.video.name);
                if (idx !== -1) this.setState(state => ({ video: sources[idx - 1] || state.video }))
            }
        ) : this.setState({ video: empty }))
        .catch(err => console.log(err));
    };
    
    delete = () => {
        fetch(new Request('/api/sources/' + this.props.user + '/' + this.state.video.name), 
        { method: "DELETE" })
        .then(this.getFirstVideo)
        .catch(err => console.log(err));
    };

    onUploadComplete = (source) => {
        this.setState({ 
            video: source,
            showAddForm: false
        });
    };

    render() {
        return (
            <div>
                <NavBar 
                    view={this.props.view}
                    video={this.state.video}
                    onSwitchView={() => this.props.onSwitchView("compilations")}
                    isOwner={this.isOwner}
                    onLogout={this.props.onLogout}
                    onSearchFormToggle={this.toggleSearchForm}
                    onAddFormToggle={this.toggleAddForm}
                    onNext={this.next}
                    onPrev={this.prev}
                    onDelete={this.delete}
                />
                <div className="video-box">
                    {!this.state.showSearchForm ? null :
                        <SearchForm />}
                    <ViewBox 
                        video={this.state.video}
                        time={this.state.timeIndex}
                        videoDuration={this.state.duration}
                        setDuration={(duration => this.setState({ duration: duration }))} 
                        ref={this.playerRef}
                    />
                    {!this.state.showAddForm ? null :
                        <AddForm user={this.props.user} onUploadComplete={this.onUploadComplete} />}
                </div>
                {!this.isOwner() ? null : <ClipsBox 
                    view={this.props.view}
                    user={this.props.user}
                    video={this.state.video}
                    videoDuration={this.state.duration}
                    onDisplay={this.goToClip}
                />}
            </div>
        );

    }
}

export default SourceClipper;