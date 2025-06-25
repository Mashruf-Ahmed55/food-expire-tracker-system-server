import mongoose, { Schema } from 'mongoose';

const noteSchema = new Schema({
  text: {
    type: String,
    default: null,
  },
  postedDate: {
    type: Date,
    default: null,
  },
});

const foodSchema = new Schema<IFood>(
  {
    food_image: {
      type: String,
      required: true,
    },
    food_title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    addedDate: {
      type: Date,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    notes: [noteSchema],
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model<IFood>('Food', foodSchema);
export default Food;
