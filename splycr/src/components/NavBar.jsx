import React, { Component } from 'react';
import '../style/nav-bar.css'
import Button from './Button.jsx';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formActive: props.formActive || null,
            titleEditable: false,            
            user: this.props.user
        };
    }

    onAddCompilation = () => this.setState({ titleEditable: false }, this.props.onAddCompilation);

    isOwner = () => this.props.project.owner === this.state.user;

    render() {
        let addIcon = this.props.view === "sources" ? "icono-plus" : "icono-hamburger";
        return (
            <div className="navbar section">
                <Button icon="icono-search" onClick={this.props.onSearchFormToggle}/>
                <Button icon="icono-cross" onClick={this.props.onLogout}/>
                <TitleInfo 
                    title={this.props.video.title}
                    author={this.props.video.owner} 
                    date={this.props.video.date}
                    error={this.props.error}
                    titleEditable={this.state.titleEditable}
                    onUpdateTitle={this.props.onUpdateTitle}
                />
                {this.props.view !== "compilations" ? null :
                    this.state.titleEditable ? 
                        <Button icon="icono-check" onClick={this.onAddCompilation} /> :
                        <Button icon="icono-plus" onClick={() => this.setState({ titleEditable: true })} />}
                <Button icon="icono-sliders" onClick={this.props.onSwitchView} />
                <Button icon="icono-caretLeft" onClick={this.props.onPrev} />
                <Button icon="icono-caretRight" onClick={this.props.onNext} />
                {!this.isOwner ? null : <Button icon="icono-trash" onClick={this.props.onDelete} />}
                {!this.isOwner ? null : <Button icon={addIcon} onClick={this.props.onAddFormToggle} />} 
            </div>
        );
    }
}


class TitleInfo extends Component {
    render() {
        return (
            <div className="title-info">
                <div>
                    <h1 className="title">
                        {this.props.titleEditable ? 
                            <input 
                                value={this.props.title} 
                                onChange={event => this.props.onUpdateTitle(event.target.value)}
                            /> 
                        : this.props.title}
                    </h1>
                </div>
                <div>{this.props.author}</div>
                <div>{this.props.date}</div>
                <div>{this.props.error}</div>
            </div>
        );
    }

}

export default NavBar;