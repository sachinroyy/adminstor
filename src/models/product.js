import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
    default: () => new mongoose.Types.ObjectId()
  },
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  categories: [{
    type: String,
    default: []
  }],
  image: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Pre-save hook to ensure _id is properly set
ProductSchema.pre('save', function(next) {
  if (!this._id || this._id === '') {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
