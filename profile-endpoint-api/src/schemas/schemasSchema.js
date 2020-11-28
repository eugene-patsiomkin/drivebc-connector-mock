import mongoose from 'mongoose'

const schemasSchema = new mongoose.Schema(
    {},
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

export default schemasSchema;