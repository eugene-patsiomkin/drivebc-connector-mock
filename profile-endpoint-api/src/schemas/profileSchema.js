import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
    {},
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

export default profileSchema;