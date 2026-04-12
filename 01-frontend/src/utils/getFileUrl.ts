const getFileUrl = (id: number, download: boolean = false) =>
  `${import.meta.env.VITE_BACKEND_URL}/files/${id}?download=${download.toString()}`;

export default getFileUrl;
