const kongAdminHost = "http://localhost:8001";
const getAclGroup = (tags) => {
    if (!tags || tags.length < 1) {
        throw new Error('No acl info attached to a route.');
    }

    let aclTags = tags.filter(t => t.includes("acl~"));
    if (aclTags.length < 0) {
        throw new Error('No acl info attached to a route.');
    }

    return aclTags[0].replace("acl~", "");
}

const userExists = async userId => {
    const res = await fetch(`${kongAdminHost}/consumers/${userId}`);
    if (res.status >= 400) {
        throw new Error("Customer not found")
    }
}

const routeExists = async routeId => {
    const res = await fetch(`${kongAdminHost}/routes/${routeId}`);
    if (res.status >= 400) {
        throw new Error("Route not found")
    }
}

const authKey = {
    post: async (req, res) => {
        const customerId = req.body.customer_id;
        const routeId = req.body.route_id;

        await Promise.all([
            userExists(customerId),
            routeExists(routeId)
        ]) ;

        const r = await fetch(`${kongAdminHost}/routes/${routeId}`);
        const d = await r.json();

        const aclGroup = getAclGroup(d.tags);
        await fetch(`${kongAdminHost}/consumers/${customerId}/acls`, {
            method: "POST",
            body: JSON.stringify({group: aclGroup}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const rk = await fetch(`${kongAdminHost}/consumers/${customerId}/key-auth`);
        let dk = await rk.json();

        if (!dk || !dk.data || dk.data.length < 1) {
            const authKeyCreate = await fetch(`${kongAdminHost}/consumers/${customerId}/key-auth`, {
                method: "POST",
            });

            dk = {data:[await authKeyCreate.json()]}
        }

        return dk.data[0].key;
    }
}

export default async function handler(req, res) {
    let method = req.method.toLowerCase();

    try {
        if (method in authKey) {
            let result = await authKey[method](req, res);
            res.status(200).json({key: result});
        } else {
            res.status(405).json({error: "Method Not Allowed"});
        }
    } catch (error) {
        res.status(500).json({error: "Server error", message: error.message});
    }
}