import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
    {
        bid : {
            type: mongoose.Schema.Types.String,
            required: true,
            unique: true,
            index: true
        },
        schedule: {
            type: mongoose.Schema.Types.Array,
            validate: {
                validator: v => v && v.length > 0,
                message: "Can not be empty"
            },
            items: {
                type: mongoose.Schema.Types.Object,
                properties: {
                    starts_on: {
                        type: mongoose.Schema.Types.String,
                        required: true,
                        index: true
                    },
                    ends_by: {
                        type: mongoose.Schema.Types.String,
                        required: true,
                        index: true
                    }
                }
            }
        },
        type: {
            tags:{
                type: [String],
                validate: {
                    validator: v => v && v.length > 0,
                    message: "Can not be empty"
                },
                index: true
            },
            severity: {
                type: String,
                enum: ["MINOR", "MODERATE", "MAJOR", "UNKNOWN"],
                default: "UNKNOWN",
                required: true
            },
            planned: Boolean,
            active: {
                type: Boolean,
                index: true,
            }
        },
        geometry: {
            required: true,
            type: Object,
            properties: {
                type: {
                    type: String,
                    enum: ["Point", "LineString", "Polygon", "MultiPoint", "MultiLineString", "MultiPolygon"]
                },
                coordinates: {
                    type: mongoose.Schema.Types.Mixed
                }
            }
        }
    },
    {
        timestamps: {
            createdAt: 'created_on',
            updatedAt: 'updated_on'
        }
    }
);

eventSchema.index({geometry: "2dsphere"});
export default eventSchema;