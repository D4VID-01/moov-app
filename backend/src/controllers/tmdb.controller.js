// 1. Importamos axios, librería para hacer peticiones HTTP
import axios from "axios";

// 2. Constantes base
const TMDB_BASE = "https://api.themoviedb.org/3"; // URL base de la API de TMDB
const TMDB_KEY = process.env.TMDB_API_KEY;        // API Key, guardada en variables de entorno (.env)

// 3. Función auxiliar para construir la URL de la petición
const buildUrl = (path, params = {}) => {
    // Creamos el objeto URL con la ruta base + path
    const url = new URL(`${TMDB_BASE}${path}`);

    // Siempre se debe incluir la API key
    url.searchParams.set("api_key", TMDB_KEY);

    // Recorremos los parámetros extra y los añadimos si no son null/undefined
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });

    // Retornamos la URL completa en formato string
    return url.toString();
};

// 4. Función genérica para llamar a la API de TMDB
export const fetchFromTmdb = async (path, params = {}) => {
    // Si no existe la API key, lanzamos error
    if (!TMDB_KEY) throw new Error("TMDB_API_KEY no definido.");

    if (!params.language) params.language = "es-ES";

    // Construimos la URL con ayuda de buildUrl
    const url = buildUrl(path, params);

    // Usamos axios para hacer la petición GET a la URL
    const { data } = await axios.get(url);

    // Retornamos solo la data (respuesta en JSON de TMDB)
    return data;
};

// ---------------------------------------------------------------
// 5. Controlador: búsqueda en TMDB
// Ruta típica: GET /api/tmdb/search?query=avatar&page=1
export const search = async (req, res, next) => {
    try {
        const { query, page = 1 } = req.query; // Obtenemos parámetros de la query

        // Validamos que venga el parámetro "query"
        if (!query) return res.status(400).json({ message: "query requerido" });

        // Llamamos a /search/multi en TMDB
        const data = await fetchFromTmdb("/search/multi", {
            query,
            page,
            include_adult: false, // Excluimos resultados +18
        });

        // Respondemos con los datos
        res.json(data);
    } catch (err) {
        next(err); // Pasamos el error al middleware de manejo de errores
    }
};

// ---------------------------------------------------------------
// 6. Controlador: obtener detalles de una película o serie
// Ruta típica: GET /api/tmdb/details/movie/550
export const getDetails = async (req, res, next) => {
    try {
        const { mediaType, id } = req.params; // Ej: movie o tv, y el ID

        // Llamamos al endpoint correspondiente: /movie/{id} o /tv/{id}
        // Con append_to_response pedimos videos e imágenes adicionales
        const data = await fetchFromTmdb(`/${mediaType}/${id}`, {
            append_to_response: "videos,images",
        });

        res.json(data);
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------
// 7. Controlador: obtener contenido en tendencia
// Ruta típica: GET /api/tmdb/trending?time_window=day&page=1
export const trending = async (req, res, next) => {
    try {
        // time_window puede ser "day" o "week"
        const { time_window = "week", page = 1 } = req.query;

        // Llamamos al endpoint de trending
        const data = await fetchFromTmdb(`/trending/all/${time_window}`, { page });

        res.json(data);
    } catch (err) {
        next(err);
    }
};

// ---------------------------------------------------------------
// 8. Controlador: descubrir películas o series
// Ruta típica: GET /api/tmdb/discover?mediaType=tv&page=2
export const discover = async (req, res, next) => {
    try {
        const { mediaType = "movie", page = 1 } = req.query;

        // Según el tipo de medio, armamos la ruta correspondiente
        const path = mediaType === "tv" ? "/discover/tv" : "/discover/movie";

        // Llamamos al endpoint con paginación y orden por popularidad
        const data = await fetchFromTmdb(path, {
            page,
            sort_by: "popularity.desc",
        });

        res.json(data);
    } catch (err) {
        next(err);
    }
};