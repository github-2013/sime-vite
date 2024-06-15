// windows下路径适配
function normalizePath(path) {
    return path.replace(/\\/g, '/')
}

export { normalizePath }
