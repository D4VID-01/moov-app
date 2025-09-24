import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tmdbId: {
        type: Number,
        required: true,
        index: true
    },
    mediaType: {
        type: String,
        enum: ['movie', 'tv'],
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, { timestamps: true });

// Índice compuesto único: un usuario no puede calificar dos veces el mismo contenido
RatingSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model('Rating', RatingSchema);
