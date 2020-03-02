import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import ClipsBox from './ClipsBox.jsx';
import ViewBox from './ViewBox.jsx';
import EffectsForm from './EffectsForm.jsx';
import SearchForm from './SearchForm.jsx';


const empty = {
    owner: null,
    title: "No Projects",
    clips: [],
    codec: "ffmpeg",
    container: "mp4",
    effects: [],
    error: null
};

class CompilationEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onLogout: props.onLogout,
            onSwitchView: props.onSwitchView,
            project: empty,
            showSearchForm: false,
            showEffectsForm: false,
        };
    }

    componentDidMount = () => this.getFirstProject();

    isOwner = () =>
        this.state.project.owner === null || this.state.project.owner === this.props.user;

    toggleSearchForm = () => this.setState(state => ({
        showEffectsForm: false,
        showSearchForm: !state.showSearchForm
    }));

    toggleAddForm = () => this.setState(state => ({
        showSearchForm: false,
        showEffectsForm: !state.showEffectsForm
    }));

    compile = () => {
        console.log("compile", this.state.project.codec, this.state.project.container);
        // for clip in this.state.project: build and output mp4
    };

    addProject = () => fetch(new Request('/api/projects/' + this.props.user), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.project)
    }).then(response => response.ok
        ? response.json().then(project => this.setProject(project))
        : response.text().then(msg => this.setState({ error: msg }))
    ).catch(err => this.setState({ error: err }));

    getFirstProject = () => {
        fetch(new Request('/api/projects/' + this.props.user + '/'))
            .then(response => response.ok
                ? response.json().then(
                    projects => projects.length > 0
                        ? this.setState({ project: projects[0] })
                        : this.setState({ project: empty }))
                : this.setState({ project: empty }))
            .catch(err => console.log(err));
    }

    next = () => {
        fetch(new Request('/api/projects/' + this.props.user + '/'))
            .then(response => response.ok ? response.json().then(
                projects => {
                    let idx = projects.map(s => s.title).indexOf(this.state.project.title);
                    if (idx !== -1)
                        this.setState(state => ({ project: projects[idx + 1] || state.project }))
                }
            ) : this.setState({ project: empty }))
            .catch(err => console.log(err));
    };

    prev = () => {
        fetch(new Request('/api/projects/' + this.props.user + '/'))
            .then(response => response.ok ? response.json().then(
                projects => {
                    let idx = projects.map(s => s.title).indexOf(this.state.project.title);
                    if (idx !== -1)
                        this.setState(state => ({ project: projects[idx - 1] || state.project }))
                }
            ) : this.setState({ project: empty }))
            .catch(err => console.log(err));
    };

    delete = () => fetch(new Request(
            '/api/projects/' + this.props.user + "/" + this.state.project._id + "/",
            { method: "DELETE" })
    ).then(this.getFirstProject)
    .catch(err => console.log(err));

    setProject = (project) => this.setState({ error: null, project: project });

    submitEffect = (effect) => {
        console.log(effect);
    }

    titleUpdate = title => this.setState(state => {
        state.project.title = title;
        return { project: state.project }
    });

    projectUpdate = fields => this.setState(
        state => ({ project: Object.assign(state.project, fields) }),
        this.uploadUpdate);

    includeClip = clipId => this.setState(
        state => ({ project: Object.assign(state.project, 
            {clips: state.project.clips.concat([clipId]) })
        }), this.uploadUpdate
    );

    uploadUpdate = () => fetch(new Request(
        "/api/projects/" + this.props.user + "/" + this.state.project._id + "/", {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.project)
    })).then(console.log);

    render() {
        return (
            <div>
                <NavBar
                    view={this.props.view}
                    video={this.state.project}
                    error={this.state.error}
                    isOwner={this.isOwner}
                    onSwitchView={() => this.props.onSwitchView("sources")}
                    onLogout={this.props.onLogout}
                    onSearchFormToggle={this.toggleSearchForm}
                    onAddFormToggle={this.toggleAddForm}
                    onAddCompilation={this.addProject}
                    onNext={this.next}
                    onPrev={this.prev}
                    onDelete={this.delete}
                    onUpdateTitle={this.titleUpdate}
                />
                <div className="video-box">
                    {!this.state.showSearchForm ? null :
                        <SearchForm
                            searchFor="clips"
                            onIncludeClip={this.includeClip}
                        />}
                    <ViewBox video={this.state.project} />
                    {!this.state.showEffectsForm ? null :
                        <EffectsForm onEffectSubmit={this.submitEffect} />}
                </div>
                {!this.isOwner() ? null : <ClipsBox
                    compileVideo={this.compile}
                    view={this.props.view}
                    user={this.props.user}
                    video={this.state.project}
                    onDisplay={this.goToClip}
                    container={this.state.container}
                    containerUpdate={container => this.projectUpdate({ "container": container })}
                    codec={this.state.codec}
                    codecUpdate={codec => this.projectUpdate({ "codec": codec })}
                />}
            </div>
        );
    }
}

export default CompilationEditor;