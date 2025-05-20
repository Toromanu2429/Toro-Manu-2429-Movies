import api from "../api";

export const getFavoriteMovies = async (guestSessionId: string, page = 1) => {
  let res: any;
  const endpoint = `/account/${guestSessionId}/favorite/movies?language=en-US&page=${page}`;
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
