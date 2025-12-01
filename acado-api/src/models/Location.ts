// src/models/Location.ts
import { Schema, model, Model, Document } from 'mongoose';

export interface ILocation {
  country: string;
  state: string;
  city: string;
}

export type LocationDocument = Document<unknown, {}, ILocation> & ILocation;
export type LocationModel = Model<ILocation>;

const LocationSchema = new Schema<ILocation, LocationModel>(
  {
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

LocationSchema.index({ country: 1 });
LocationSchema.index({ country: 1, state: 1 });
LocationSchema.index({ country: 1, state: 1, city: 1 }, { unique: true });

export default model<ILocation, LocationModel>('Location', LocationSchema);


