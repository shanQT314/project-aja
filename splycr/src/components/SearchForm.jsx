import React, { Component } from 'react';
import '../style/form.css';
import MiniClipsBox from './MiniClipsBox.jsx';

class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerms: [],
            clips: []
        };
    }

    updateSearch = (event) => this.setState(
        { searchTerms: event.target.value.split(',').map(s => s.trim()) },
        () => fetch("/api/search/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.state.searchTerms)
        }).then(response => response.ok ? response.json().then(
            clips => this.setState({ clips: clips })
        ) : () => console.log("failed search"))
    );


    render() {
        return (
            <div className="search-form section">
                <form onSubmit={e => e.preventDefault()}>
                    <input
                        className="field input" 
                        placeholder="Tag1, Tag2, Tag3, ..."
                        type="search"
                        name="search"
                        value={this.state.searchTerms.join(',')}
                        onChange={this.updateSearch}
                    />
                </form>
                <MiniClipsBox
                    clips={this.state.clips}
                    onIncludeClip={this.props.onIncludeClip}
                />
            </div>
        );
    }
}

export default SearchForm;