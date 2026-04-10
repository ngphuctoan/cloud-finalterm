const toFileSizeFormat = (sizeBytes: number, rounding: number = 2) => {
  if (sizeBytes < 1_024) {
    return `${sizeBytes} B`;
  }
  const units = ["KiB", "MiB", "GiB"];
  for (let i = 1; i <= units.length; i++) {
    const newSize = sizeBytes / 1_024 ** i;
    if (newSize < 1_024 || i === units.length) {
      return `${newSize.toFixed(rounding)} ${units[i - 1]}`;
    }
  }
};

export default toFileSizeFormat;
