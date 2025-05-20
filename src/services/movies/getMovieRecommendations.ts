import api from "../api";

export const getMovieRecommendations = async (movieId: string) => {
  let res: any;
  const endpoint = `/movie/${movieId}/recommendations?language=en-US`;
  await api
    .get(endpoint)
    .then((d) => {
      res = d.data;
    })
    .catch((err) => {
      res = err.response;
    });

  return res;
};
