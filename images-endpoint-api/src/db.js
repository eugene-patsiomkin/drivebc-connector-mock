import mongoose from 'mongoose';
import profileSchema from './schemas/profileSchema.js';
import schemasSchema from './schemas/schemasSchema.js';

const Models = {
    Profile: mongoose.model('profile', profileSchema),
    Schema: mongoose.model('sch', schemasSchema)
};

const connectDB = () => {
    let host = process.env.MOTI_API_MONGO_DB_HOST || "localhost";
    console.log(`Connecting monogo @ ${host}`);
    return mongoose.connect(
        `mongodb://profile-api:profile-api@${host}:27017/profile-db`
        , { 
            useNewUrlParser: true
            , useUnifiedTopology: true
            , useCreateIndex: true
        });
}

export {Models, connectDB};
export default Models;