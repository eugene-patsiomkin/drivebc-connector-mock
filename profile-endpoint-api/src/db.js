import mongoose from 'mongoose';
import profileSchema from './schemas/profileSchema.js';

const Models = {
    Event: mongoose.model('Event', profileSchema)
};

const connectDB = () => {
    let host = process.env.MOTI_API_MONGO_DB_HOST || "localhost";
    console.log(`Connecting monogo @ ${host}`);
    return mongoose.connect(
        `mongodb://profile-api:profile-api@${host}:27017/profile-db`
        , { useNewUrlParser: true, useUnifiedTopology: true});
}

export {Models, connectDB};
export default Models;