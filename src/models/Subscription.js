import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: { type: String, default: 'starter' },
    provider: { type: String, enum: ['payfast', 'stripe'], default: 'payfast' },
    status: { type: String, enum: ['inactive', 'active', 'past_due', 'canceled'], default: 'inactive' },
    providerRef: String,
    currentPeriodEnd: Date
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
