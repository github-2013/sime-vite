import serverStatic from 'serve-static'

function staticMiddleware({ root }) {
    return serverStatic(root)
}

export default staticMiddleware;
