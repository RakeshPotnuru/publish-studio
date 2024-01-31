export const formatFileSize = (size: number) => {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const units = ["B", "kB", "MB", "GB", "TB"] as const;

    return `${Number.parseFloat((size / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
};
