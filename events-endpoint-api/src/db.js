import mongoose from 'mongoose';
import eventSchema from './schemas/eventSchema.js';

const Models = {
    Event: mongoose.model('Event', eventSchema)
};

const connectDB = () => {
    return mongoose.connect(
        'mongodb://event-api:event-api@localhost:27017/event-db'
        , { useNewUrlParser: true, useUnifiedTopology: true});
}

export {Models, connectDB};
export default Models;