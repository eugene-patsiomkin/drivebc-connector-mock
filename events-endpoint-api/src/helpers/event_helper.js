import { UserInputError } from "../errors.js";

const PIPE_SYMBOL = "|"

const setIdList = (searchQuery, value) => {
    if (!value) return searchQuery;

    let query = {...searchQuery};
    query.bid = {$in: []};
    value.split(PIPE_SYMBOL).forEach((bid) => {
        query.bid.$in.push(bid);
    });

    return query;
}

const setTags = (searchQuery, value) => {
    if (!value) return searchQuery;

    let query = {...searchQuery};
    query['type.tags'] = {$in: []};
    value.split(PIPE_SYMBOL).forEach((bid) => {
        query['type.tags'].$in.push(bid);
    });

    return query;
}

const setStartsAfter = (searchQuery, value) => {
    if (!value) return searchQuery;

    let query = {...searchQuery};
    query['schedule.starts_on'] = {$gt: value};

    return query;
}

const setEndsBy = (searchQuery, value) => {
    if (!value) return searchQuery;

    let query = {...searchQuery};
    query['schedule.ends_by'] = {$lt: value};

    return query;
}


const query_builder = (requestQuery) => {
    if(requestQuery.geometry && requestQuery.geofence)
        throw new UserInputError("Can use either geometry or geofence not both");
    
    let searchQuery = {
        "type.active": true
    }

    Object.entries(requestQuery).forEach(([key, value]) => {
        switch (key) {
            case 'include_nonactive':
                if (value && value.toLowerCase() === "true")
                    delete searchQuery["type.active"];
                
                break;
            case 'id_list':
                searchQuery = setIdList(searchQuery, value);
                break;
            case 'tags':
                searchQuery = setTags(searchQuery, value);
                break;
            case "starts_after":
                searchQuery = setStartsAfter(searchQuery, value);
                break;
            case "ends_by":
                searchQuery = setEndsBy(searchQuery, value);
                break;
            default:
                break;
        }
    });

    console.log(searchQuery);

    return searchQuery
}

export {query_builder};