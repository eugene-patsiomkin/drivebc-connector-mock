import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
    {
        owner_id : {
            type: String,
            required: true
        },
        profile : {
            type: String,
            required: true
        },
        validation_schema_name : {
            type: String,
            required: true
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

profileSchema.index({application_key: 1, owner_id: 1, validation_schema_name: 1}, {unique:true});

export default profileSchema;