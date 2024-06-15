import { build } from 'esbuild'
import { esbuildScanPlugin } from './scanPlugin.js'

// 分析项目中的import
async function scanImports(config) {
    // 保存扫描到的依赖
    const depImports = {}
    // 创建esbuild扫描插件
    const scanPlugin = await esbuildScanPlugin(config, depImports)
    // 借助esbuild进行依赖预构建
    await build({
        // 当前工作目录
        absWorkingDir: config.root,
        // 入口文件
        entryPoints: config.entryPoints,
        // 是否需要打包第三方插件，默认esbuild并不会，这里声明为true
        bundle: true,
        // 打包后格式为esm
        format: 'esm',
        // 不需要将打包结果写入到硬盘中
        write: false,
        // 自定义的scan插件
        plugins: [scanPlugin]
    })

    return depImports;
}

export { scanImports }
