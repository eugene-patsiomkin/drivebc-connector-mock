import React, {Component} from "react"

const linkStyle = "inline-block hover:text-blue-900 hover:bg-blue-50 rounded-xs";

const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <> { parts.map((part) => 
        <span className={part.toLowerCase() === highlight.toLowerCase() ? 'bg-yellow-200 bg-opacity-40' : '' }>
            { part }
        </span>)
    } </>;
}

class ServiceInfo extends Component {
    render() {
        let name = this.props.name || "N/A";
        let description = this.props.description || "N/A";
        let filter = this.props.filter || false

        if (filter) {
            name = highlightText(name, filter);
            description = highlightText(description, filter);
        }

        return (
            <article className="rounded-xl p-3 mt-4 from-blue-50 to-green-50 bg-gradient-to-r">
                <header className="font-bold text-xl mb-3">{name}</header>
                <main>{description}</main>
                <footer className="space-x-4 text-sm text-right">
                    <a className={linkStyle} href={this.props.document_link} target="_blank">Documentation</a>
                    <a className={linkStyle} href={this.props.get_api_key_link} target="get_api_key">Get API key</a>
                </footer>
            </article>
        );
    }
}

export default ServiceInfo