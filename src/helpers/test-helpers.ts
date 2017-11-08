export const outputPaths = (...dirs) =>
    process.platform === 'win32'
        ? dirs.join('\\')
        : dirs.join('/')