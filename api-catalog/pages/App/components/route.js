import React, {Component} from "react"

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
                name: val.name
            };
        });

        this.setState((state, props) => {
            return { ...state, routes: routes};
        });
    }

    render() {
        let routes = [];

        if (this.state.routes) {
            routes = this.state.routes.map((route, idx) => (
                <div key={idx}><b className="mr-2">Name</b>{route.name}</div>
            ));
        }

        return (
            <article className="p-3 mt-4">
                {routes}
            </article>
        );
    }
}

export default RouteInfo
