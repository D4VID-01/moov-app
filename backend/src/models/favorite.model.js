import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    // Usuario que marca el favorito (referencia a la colección 'User')
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // ID de la película o serie según TMDB
    tmdbId: {
        type: Number,
        required: true,
        index: true // índice para búsquedas rápidas
    },

    // Tipo de media: película o serie
    mediaType: {
        type: String,
        enum: ['movie', 'tv'], // solo permite estos dos valores
        required: true
    },

    // 🔹 Fecha de creación del favorito
    createdAt: {
        type: Date,
        default: Date.now // si no se pasa fecha, se usa la actual
    }
});

// Índice compuesto único para evitar duplicados
// Esto garantiza que un usuario no pueda marcar el mismo contenido más de una vez
FavoriteSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

export default mongoose.model('Favorite', FavoriteSchema);
