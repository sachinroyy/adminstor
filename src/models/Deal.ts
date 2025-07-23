import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  name: string;
  offer: string;
  description?: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Deal name is required'],
      trim: true,
      maxlength: [100, 'Deal name cannot exceed 100 characters'],
    },
    offer: {
      type: String,
      required: [true, 'Offer is required'],
      trim: true,
      maxlength: [50, 'Offer cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text index for search functionality
DealSchema.index({ name: 'text', description: 'text', offer: 'text' });

// Create model if it doesn't exist
export default mongoose.models.Deal || mongoose.model<IDeal>('Deal', DealSchema);
