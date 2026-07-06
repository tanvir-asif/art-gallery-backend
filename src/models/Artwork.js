import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: '', trim: true, maxlength: 2000 },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Return a lean, client-friendly shape.
artworkSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    title: this.title,
    description: this.description,
    imageUrl: this.imageUrl,
    width: this.width,
    height: this.height,
    order: this.order,
    createdAt: this.createdAt,
  };
};

export const Artwork = mongoose.model('Artwork', artworkSchema);
