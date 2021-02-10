import React, {Component} from "react";
import {serverHost} from "../../helpers/service";
import Endpoints from "../endpoints"

const linkStyle = "inline-block hover:text-blue-900 hover:bg-blue-50 rounded-xs";

const highlightText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return <> { parts.map((part, i) => 
        <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? 'bg-yellow-200 bg-opacity-40' : '' }>
            { part }
        </span>)
    } </>;
}

class ServiceInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};

        this.loadDocumentLink();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({... nextProps});  
    }

    async loadDocumentLink() {
        const res = await fetch(`http://localhost:8001/services/${this.state.service_name}/routes?tags=type~documentation_link`)
        const data = await res.json()

        if (!data || !data.data || data.data.length < 1) {
            return {
                notFound: true,
            }
        }

        this.setState((state, props) => {
            return { ...state, document_link: `${serverHost}${data.data[0].paths[0]}/`};
        });
    }

    render() {
        let name = this.state.name || "N/A";
        let description = this.state.description || "N/A";
        let filter = this.state.filter || false

        if (filter) {
            name = highlightText(name, filter);
            description = highlightText(description, filter);
        }

        return (
            <article className="rounded-md p-2 mt-4 from-blue-50 to-green-50 bg-gradient-to-r text-sm">
                <header className="font-bold text-xl mb-3">{name}</header>
                <main>
                    <section>
                        {description}
                        <footer className="space-x-4 text-sm text-right">
                            <a className={linkStyle} href={this.state.document_link} target="_blank">Documentation</a>
                        </footer>
                    </section>
                    <Endpoints endpoint_root={this.state.service_name} />
                    {/* <section>
                        <header className="font-bold text-lg mb-3">Endpoints</header>
                        {routes}
                        <footer className="space-x-4 text-sm text-right">
                            <a className={linkStyle} href={this.state.get_api_key_link} target="get_api_key">Get API key</a>
                        </footer>
                    </section> */}
                </main>
            </article>
        );
    }
}

export default ServiceInfo
