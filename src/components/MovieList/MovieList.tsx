'use client';
import Link from "next/link";
import React from "react";
import MovieCard from "@/components/MovieCard/MovieCard";
import { IMovieDetail } from "@/types/IMovieDetail";

interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  overview: string;
}

interface MovieListProps {
  movies: IMovieDetail[];
  from: string;
}

const MovieList: React.FC<MovieListProps> = ({ movies, from }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies?.map((movie) => (
        <Link
          key={movie.id}
          href={{
            pathname: `/movie/${movie.id}`,
            query: { from },
          }}
        >
          <MovieCard
            title={movie.title}
            voteAverage={movie.vote_average}
            posterPath={movie.poster_path}
            releaseYear={new Date(movie.release_date).getFullYear()}
            description={movie.overview}
          />
        </Link>
      ))}
    </div>
  );
};

export default MovieList;
