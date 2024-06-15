import connect from 'connect'
import nodeHttp from 'node:http'
import staticMiddleware from './middleware/staticMiddleware.js'
import resolveConfig from '../config.js'
import {createOptimizeDepsRun} from './optimize/index.js'

// 创建开发服务器
async function createServer() {
    // 创建connect实例
    const app = connect()
    // 模拟解析配置文件（读取vite.config.js）
    const config = await resolveConfig()
    // 使用静态资源中间件
    app.use(staticMiddleware(config))

    return {
        async listen(port, callback) {
            // 启动服务之前进行预构建
            await runOptimize(config);
            // 启动服务
            nodeHttp.createServer(app).listen(port, callback)
        }
    }
}

// 预构建
async function runOptimize(config) {
    await createOptimizeDepsRun(config)
}

export { createServer, runOptimize }
