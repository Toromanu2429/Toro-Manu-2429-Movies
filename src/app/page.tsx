'use client';
import React, { useEffect, useState } from 'react';
import { getNowPlayingMovies } from '@/services/movies/getNowPlayingMovies';
import { getTopRatedMovies } from '@/services/movies/getTopRatedMovies';
import { getPopularMovies } from '@/services/movies/getPopularMovies';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Config from '@/config';

const Home = () => {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const now = await getNowPlayingMovies(1);
        const top = await getTopRatedMovies(1);
        const pop = await getPopularMovies(1);
        setNowPlaying(now.results);
        setTopRated(top.results);
        setPopular(pop.results);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    };

    fetchAll();
  }, []);

  const renderSection = (title: string, movies: any[], from: string) => (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link href={`/movie/${movie.id}?from=${from}`}>
              <div className="rounded-lg overflow-hidden shadow-md hover:scale-105 transition">
                <Image
                  src={Config.IMAGE_SOURCE + movie.poster_path}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="object-cover"
                />
                <div className="p-2 text-center font-medium">{movie.title}</div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Cineverse 🎥</h1>
      {renderSection('Now Playing', nowPlaying, 'now-playing')}
      {renderSection('Top Rated', topRated, 'top-rated')}
      {renderSection('Popular', popular, 'popular')}
    </div>
  );
};

export default Home;
