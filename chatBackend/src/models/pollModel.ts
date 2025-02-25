import mongoose, { Schema, Document } from "mongoose";

// Define PollOption sub-document
interface PollOption {
  text: string;
  votes: number; // Number of votes for this option
}

// Define Poll document interface
export interface IPoll extends Document {
  question: string;
  options: PollOption[];
  creatorId: mongoose.Types.ObjectId; // Reference to the creator user
  createdAt: Date;
  votedUsers: Map<string, number>; // Store userId and selected option index

}

// Define Mongoose schema
const PollSchema: Schema<IPoll> = new Schema({
  question: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  options: [
    {
      text: { type: String, required: true, trim: true },
      votes: { type: Number, default: 0, min: 0 },
    },
  ],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  votedUsers: {
    type: Map,
    of: Number, // Stores { userId: optionIndex }
    default: new Map(),
  },
});

// Create and export Mongoose model
export default mongoose.model<IPoll>("Poll", PollSchema);
