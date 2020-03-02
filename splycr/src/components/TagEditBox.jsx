import React, {Component} from 'react';


class TagEditBox extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onTagsUpdate = props.onTagsUpdate;
    }

    update = event => {
        let tags = event.target.value.split(',').map((s) => s.trim());
        this.onTagsUpdate(tags);
    };

    makeTags = () => {
        let tags = this.props.tags.join(",");
        return this.props.edit ? <input placeholder="tag1,tag2,..." value={tags} onChange={this.update} className="input field"/> : tags;
    };
    
    render() {
        return (
            <div className="is-fullwidth">
                Tags: {this.makeTags()}
            </div>
        );
    }
}

export default TagEditBox;