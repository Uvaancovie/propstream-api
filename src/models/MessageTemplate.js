import mongoose from 'mongoose';

const msgTplSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    subject: String,
    body: { type: String, required: true }, // supports {{guestName}}, {{checkIn}}, {{propertyTitle}}
    variables: [String]
  },
  { timestamps: true }
);

export default mongoose.model('MessageTemplate', msgTplSchema);
