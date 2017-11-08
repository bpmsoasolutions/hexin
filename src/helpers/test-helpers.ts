export const outputPaths = (...dirs) =>
    process.env['win32']
        ? dirs.join('\\\\')
        : dirs.join('/')