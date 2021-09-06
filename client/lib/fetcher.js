import unfetch from "isomorphic-unfetch";

export default async function fetcher(input, init) {
  const res = await unfetch(input, init);
  if (res.ok) {
    return res.json();
  }

  const json = await res.json();
  const error = new Error(json?.message || res.statusText);
  error.response = res;

  return Promise.reject(error);
}
