import { Schema } from 'mongoose';

export interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, 'name is required'] },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

productSchema.methods.toJSON = function (): ProductData {
  const { _id, ...rest } = this.toObject();
  rest.id = _id;
  return rest as ProductData;
};

export default productSchema;
