import React, {Component} from "react"
import {AccessKey, RequestAccess} from "./accessKey"

const getType = tags => {
    return tags.filter(t => t.includes('group~'))[0].replace('group~', '');
};

class RouteInfo extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};

       this.getRoutes();
    }

    async getRoutes () {
        const res = await fetch(`http://localhost:8001/services/${this.state.service_name}/routes`);
        const data = await res.json();

        if (!data || !data.data || data.data.length < 1) {
            return {
                notFound: true,
            }
        }
        
        let routes = data.data.map((val, idx) => {
            this.setState((state, props) => {
                return { ...state, routes: []};
            });

            return {
                name: val.name,
                type: getType(val.tags),
                methods: val.methods

            };
        });

        this.setState((state, props) => {
            return { ...state, routes: routes};
        });
    }

    render() {
        let routes = [];

        if (this.state.routes) {
            routes = this.state.routes.map((route, idx) => {
                let methods = route.methods.map((m, i) => (
                    <span key={i} className="rounded-full bg-green-700 px-2 mr-2 font-bold text-xs text-white">{m}</span>
                ));
                return (
                    <section key={idx} className="mt-3">
                        <header className="text-xl">
                            {route.name}
                            <small className="ml-2">{route.type}</small>
                        </header>
                        <section>
                            <span className="font-bold mr-4">Methods</span>
                            {methods}
                        </section>
                        <section>
                            {
                                route.type.toLowerCase() == "cert" ?
                                    <RequestAccess /> : <AccessKey />
                            }
                        </section>
                    </section>
                )
            });
        }

        return (
            <article className="p-1 mt-2">
                {routes}
            </article>
        );
    }
}

export default RouteInfo
