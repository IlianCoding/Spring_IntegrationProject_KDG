const sanitizeFileName = (name: string) => {
    return name.replace(/[^a-z0-9]/gi, '').toLowerCase();
};

export default sanitizeFileName;