import nodePath from 'node:path'
import fs from 'fs-extra';
import { createPluginContainer } from './pluginContainer.js'
import resolvePlugin from './resolvePlugin.js'

const htmlTypeRe = /(\.html)$/;

const scriptModuleRe = /<script\s+src="(.+?)"\s+type="module">/

async function esbuildScanPlugin(config, depImports) {
    // vite插件容器系统
    const container = await createPluginContainer({
        plugins: [resolvePlugin({ root: config.root })],
        root: config.root
    })

    const resolveId = async (path, importer) => {
        return await container.resolveId(path, importer);
    }

    return {
        name: 'ScanPlugin',
        setup(build) {
            // 1、引入处理html入口文件
            build.onResolve({ filter: htmlTypeRe }, async ({ path, importer }) => {
                // 将传入的路径转化为绝对路径，先简化成path.resolve方法
                // const resolved = await nodePath.resolve(path);
                const resolved = await resolveId(path, importer);
                if (resolved) {
                    return {
                        path: resolved?.id || resolved,
                        namespace: 'html'
                    }
                }
            })
            // 当加载到命名空间为html的文件时
            build.onLoad({ filter: htmlTypeRe, namespace: 'html' }, async ({ path }) => {
                // 将html文件转化为js入口文件
                const htmlContent = fs.readFileSync(path, 'utf-8')
                // 读取到的html内容
                const [, src] = htmlContent.match(scriptModuleRe)
                // 读取到的src路径，路径：/main.js
                const jsContent = `import ${JSON.stringify(src)}`;
                return {
                    contents: jsContent,
                    loader: 'js'
                }
            })

            // 2、额外增加一个onResolve方法来处理其他模块（非html,比如js引入）
            build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
                // fixme：此处如何解析出来node_modules下的模块？
                const resolved = await resolveId(path, importer)
                if (resolved) {
                    const id = resolved?.id || resolved
                    if (id.includes('node_modules')) {
                        depImports[path] = id
                        return {
                            path: id,
                            external: true
                        }
                    }
                    return {
                        path: id
                    }
                }
            })
        }
    }
}

export { esbuildScanPlugin }
