import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the interface for the Category document
interface ICategory extends Document {
  name: string;
  description: string;
  image?: {
    public_id?: string;
    url?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema
const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
}, { timestamps: true });

// Create the model type
type CategoryModel = Model<ICategory>;

// Check if the model exists to avoid recompilation in development
const Category: CategoryModel = 
  (mongoose.models.Category as CategoryModel) || 
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
