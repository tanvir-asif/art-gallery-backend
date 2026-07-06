import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 40,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    username: this.username,
    createdAt: this.createdAt,
  };
};

export const Admin = mongoose.model('Admin', adminSchema);
