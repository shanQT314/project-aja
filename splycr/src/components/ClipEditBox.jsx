import React, { Component } from 'react';
import TimeIndexEditBox from './TimeIndexEditBox.jsx';
import Button from './Button.jsx';
import TagEditBox from './TagEditBox.jsx';
import '../style/tag.css';

const Clip = (function () {
    return function item(data) {
        this.id = data.id;
        this.videoid = data.videoid;
        this.owner = data.owner;
        this.startTime = data.startTime;
        this.stopTime = data.stopTime;
        this.tags = data.tags;
    };
}());

class ClipEditBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id || null,
            videoid: props.videoid || null,
            edit: props.top || false,
            owner: props.owner || null,
            startTime: props.startTime || 0,
            stopTime: props.stopTime || 0,
            tags: props.tags || [],
        };
    }

    onAdd = () => {
        fetch(new Request('/api/clips/'), {
            method: 'POST',
            headers : { 'Content-Type': 'application/json' },
            body: JSON.stringify(new Clip(this.state))
        }).then(response => response.ok ? this.props.onClipsUpdate() : console.log(response))
        .then(this.setState({ startTime: 0, stopTime: 0, tags: [] }))
        .catch(err => console.log(err));
    };

    onEdit = () => {
        /*fetch(new Request(
            '/api/clips/' + this.state.owner + '/' + this.state.videoid + '/' + this.state.id + '/',
            { method: 'PATCH'}
        )).then( */
            this.setState({ edit: false })
        //);
    };

    onDelete = () => {
        fetch(new Request(
            '/api/clips/' + this.state.owner + '/' + this.state.videoid + '/' + this.state.id + '/',
            { method: 'DELETE' }
        )).then(this.props.onClipsUpdate());
    };

    alterStart = newStart => {
        if (newStart < 0 || newStart > this.props.videoDuration) return;
        if (this.state.stopTime >= newStart) 
            this.setState({ startTime: newStart });
        else 
            this.setState({ 
                startTime: newStart,
                stopTime: newStart
            });
    }

    alterStop = newStop => {
        if (newStop < 0 || newStop > this.props.videoDuration) return;
        if (this.state.startTime <= newStop) 
            this.setState({ stopTime: newStop });
        else 
            this.setState({ 
                startTime: newStop,
                stopTime: newStop
            });
    }

    render() {
        return (
            <div className="box section">
                <div className="row">
                    <TimeIndexEditBox
                        label="Start"
                        edit={this.state.edit}
                        timeIndex={this.state.startTime}
                        onIndexUpdate={this.alterStart}
                    />
                    <TimeIndexEditBox
                        label="End"
                        edit={this.state.edit}
                        timeIndex={this.state.stopTime}
                        onIndexUpdate={this.alterStop}
                    />
                    {this.state.edit ?
                        <Button icon="icono-eye" 
                            onClick={() => this.props.onView(new Clip(this.state))} /> :
                        <Button icon="icono-trash" onClick={this.onDelete} />}
                </div>
                <div className="row">
                    <TagEditBox
                        edit={this.state.edit}
                        tags={this.state.tags}
                        onTagsUpdate={(tags) => this.setState({ tags: tags })}
                    />
                    {this.state.edit ?
                        <Button icon="icono-check" onClick={this.props.top ? this.onAdd : this.onEdit} /> :
                        <Button icon="icono-rename" onClick={() => this.setState({ edit: true })} />}
                </div>
            </div>
        );
    }
}

export default ClipEditBox;