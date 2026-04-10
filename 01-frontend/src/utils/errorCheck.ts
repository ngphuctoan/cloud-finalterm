import parseError from "./parseError";

export default async function errorCheck(res: Response) {
  const data = await res.json();
  if (!res.ok) {
    throw parseError(data);
  }
  return data;
}
