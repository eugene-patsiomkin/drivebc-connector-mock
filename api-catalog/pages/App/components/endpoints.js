import React, {Component} from "react"
import Route from "./route"

class EndpointInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};

        this.loadRelatedServices();
    }

    async loadRelatedServices() {
        const res = await fetch(`http://localhost:8001/services?tags=root~${this.state.endpoint_root},type~endpoint`);
        const data = await res.json();

        if (!data || !data.data || data.data.length < 1) {
            this.setState((state, props) => {
                return { ...state, endpoints: []};
            });
        
            return {
                notFound: true,
            }
        }
        
        let endpoints = data.data.map((val, idx) => {
            return val.name;
        });

        this.setState((state, props) => {
            return { ...state, endpoints: endpoints};
        });
    }

    render() {
        let endpoints = [];
        if (this.state.endpoints && this.state.endpoints.length > 0) {
            endpoints = this.state.endpoints.map((val, idx) => {
                return <Route key={idx} service_name={val} />
            });
        }

        return (
            <section>
                <header className="font-bold text-2xl mb-3">{this.state.endpoints ? "Endpoints" : "Loading endpoints..."}</header>
                {endpoints.length == 0 ? <span className="font-bold text-xs ml-3">Not found</span> : endpoints}
            </section>
        );
    }
}

export default EndpointInfo
