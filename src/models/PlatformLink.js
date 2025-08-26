import mongoose from 'mongoose';

const platformLinkSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    platform: { type: String, enum: ['airbnb', 'vrbo', 'booking', 'other'], required: true },
    importUrl: String, // .ics url from platform
    externalId: String
  },
  { timestamps: true }
);

export default mongoose.model('PlatformLink', platformLinkSchema);
