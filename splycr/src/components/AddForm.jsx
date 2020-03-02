import React, { Component } from 'react';
import '../style/form.css';
import Button from './Button.jsx';

class AddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            title: '',
            uploadProgress: 0,
            error: new Error("Upload a file")
        };
    }

    validate = () => this.setState(state => {
        let newError = state.title ? null : new Error("Title Required");
        newError = state.files.length === 0 ? new Error("No File Selected") : newError;
        return { error: newError };
    });

    uploadFiles = (event) => {
        event.preventDefault();
        if (this.state.error) return;
        let files = this.state.files;
        let form = new FormData();
        Object.keys(files).forEach(k => form.append('sources', files[k]));
        fetch(new Request('/api/sources/' + this.props.user + '/' + this.state.title + '/'), {
            method: 'POST',
            body: form
        })
            .then(response => !response.ok ?  this.setState({ error : new Error(response) }) : 
                response.json()
                .then(source => this.completeUpload(source))
                .catch(err => this.setState({ error: err }))
            ).catch(err => this.setState({ error: err }));
    };

    completeUpload = (source) => {
        this.setState({
            files: [],
            title: '',
            uploadProgress: 0
        });
        this.props.onUploadComplete(source);
    }

    onUpdate = (event) => {
        let newState = {}
        newState[event.target.name] = event.target.value;
        this.setState(newState, this.validate);
    }


    render() {
        return (
            <div className="add-form section">
                <form>
                    {this.state.error == null ? null : <output>{this.state.error.message}</output>}
                    <input
                        className="field input"
                        placeholder="Title"
                        type="text"
                        name="title"
                        value={this.state.title}
                        onChange={this.onUpdate}
                    />
                    <input
                        className="field file is-fullwidth"
                        type="file"
                        name="files"
                        accept="video/*"
                        value={this.state.files.length === 0 ? '' : undefined}
                        onChange={event =>
                            this.setState({ files: event.target.files || [] }, this.validate)}
                    />
                    {this.state.error !== null ? null :
                        <Button
                            className="form-element"
                            icon="icono-upArrow"
                            onClick={this.uploadFiles}
                        />
                    }

                </form>
            </div>
        );
    }
}

export default AddForm;