import mongoose from 'mongoose'

const schemasSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: true
        },
        jsonschema : {
            type: String,
            required: true
        },
        description : {
            type: String
        },
        application_key : {
            type: String,
            required: true
        }
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

schemasSchema.index({application_key: 1, name: 1}, {unique:true});

export default schemasSchema;