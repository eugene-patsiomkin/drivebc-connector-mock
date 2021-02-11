import React, {Component} from "react"

const getKeyStyle = "border-1 border-gray-300 bg-white h-10 mt-2 px-2 mr-2 rounded-md text-sm focus:outline-none";
const getKeyBtnStyle = "button bg-blue-600 text-white font-bold mx-2 px-3 h-10 rounded-md border border-blue-700 text-sm hover:bg-blue-500";

class AccessKey extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};
    };

    getAPIKey(elm) {
        console.log(elm, this.state.customer_id);
    }

    setCustomerId(txt) {
        this.setState( state => {
            return {... state, customer_id: txt}
        })
    }

    render () {
        return (
            <section>
                <header className="font-bold mt-2">Get your API key</header>
                <input className={getKeyStyle} type="text" name="customer_id" placeholder="Customer ID" onChange={e=>this.setCustomerId(e.target.value)}/>
                <button className={getKeyBtnStyle} onClick={e=>this.getAPIKey(e.target)}>Get key</button>
            </section>
        );
    };
}

class RequestAccess extends Component {
    constructor (props) {
        super(props);
        this.state = {... props};
    };

    render () {
        return (
            <a href="mailto:santa@northpole.com" target="_blank" className="link underline text-blue-500">Request Access</a>
        );
    };
}
export {AccessKey, RequestAccess};