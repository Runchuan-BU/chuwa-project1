import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discountPercent: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
export default PromoCode;