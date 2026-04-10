const normalizeFileName = (fileName: string) => {
  return fileName.trim().replace(/[^()\[\]a-zA-Z0-9._\- ]/g, "");
};

export default normalizeFileName;
