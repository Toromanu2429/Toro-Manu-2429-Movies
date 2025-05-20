'use client';
import React, { useEffect, useState } from 'react';
import { getTopRatedMovies } from '@/services/movies/getTopRatedMovies';
import MovieList from '@/components/MovieList/MovieList';

const TopRatedPage = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      setLoading(true);
      try {
        const data = await getTopRatedMovies(page);
        setMovies(data.results);
      } catch (err) {
        console.error('Error loading top rated movies: ', err);
      }
      setLoading(false);
    };

    fetchTopRatedMovies();
  }, [page]);

  return (
    <div>
      <h3 className="text-3xl font-bold mb-6">Top Rated</h3>
      {loading && <h5 className="text-lg text-gray-500">Cargando...</h5>}
      <MovieList movies={movies} from="top-rated" />
      <div className="flex gap-4 justify-center mt-6">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-gray-200 rounded">Anterior</button>
        <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-gray-200 rounded">Siguiente</button>
      </div>
    </div>
  );
};

export default TopRatedPage;
