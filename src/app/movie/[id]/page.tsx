"use client";
import { useEffect, useState } from "react";
import { IMovieDetail } from "@/types/IMovieDetail";
import Image from "next/image";
import { getMovieById } from "@/services/movies/getMovieById";
import { getMovieRecommendations } from "@/services/movies/getMovieRecommendations";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import Config from "@/config";

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovieDetail>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { guestSessionId } = useGuestSession();

  // Cargar detalles de la película
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie", err);
        setError("Could not load movie.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Recomendaciones
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const fetchRecommendations = async () => {
      try {
        const data = await getMovieRecommendations(id);
        setRecommendations(data?.results || []);
      } catch (err) {
        console.error("Error loading recommendations:", err);
      }
    };

    fetchRecommendations();
  }, [id]);

  // Verificar favoritos
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    const storedFavorites = localStorage.getItem("favoriteMovieIds");
    const favoriteIds: number[] = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];
    setIsFavorite(favoriteIds.includes(Number(id)));
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!guestSessionId || !movie) return;
    const newFavoriteState = !isFavorite;
    try {
      await markAsFavorite(movie.id, newFavoriteState, guestSessionId);
      setIsFavorite(newFavoriteState);
      const storedFavorites = localStorage.getItem("favoriteMovieIds");
      const favoriteIds: number[] = storedFavorites
        ? JSON.parse(storedFavorites)
        : [];
      const updatedFavorites = newFavoriteState
        ? [...new Set([...favoriteIds, movie.id])]
        : favoriteIds.filter((id) => id !== movie.id);
      localStorage.setItem("favoriteMovieIds", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  if (loading) return <div>Loading movie...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row gap-6">
        <Image
          src={Config.IMAGE_SOURCE + movie.poster_path}
          alt={movie.title}
          className="rounded-xl w-full sm:w-64"
          width={300}
          height={450}
        />
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="italic text-slate-500">{movie.tagline}</p>
          <p>{movie.overview}</p>
          <div>
            <strong>Release:</strong> {movie.release_date.toString()}
          </div>
          <div>
            <strong>Genres:</strong> {movie.genres.map((g) => g.name).join(", ")}
          </div>
          <div>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2 rounded ${
              isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-bold w-max`}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>

      {/* Carrusel de Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Recommended Movies</h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
          >
            {recommendations.map((rec) => (
              <SwiperSlide key={rec.id}>
                <Link href={`/movie/${rec.id}`}>
                  <div className="rounded-lg overflow-hidden shadow-md hover:scale-105 transition">
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${rec.poster_path}`}
                      alt={rec.title}
                      width={300}
                      height={450}
                      className="object-cover"
                    />
                    <div className="p-2 text-center font-medium">{rec.title}</div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;
