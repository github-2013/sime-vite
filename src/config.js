import {normalizePath} from './utils.js'
import nodePath from 'node:path'
import resolve from 'resolve';

/**
 * 寻找所在项目目录（实际源码中该函数是寻找传入目录所在最近的包相关信息）
 * @param {*} basedir
 * @returns
 */
function findNearestPackageData(basedir) {
    // 原始启动目录
    const originalBasedir = basedir;
    const pckDir = nodePath.dirname(resolve.sync(`${originalBasedir}/package.json`));
    return nodePath.resolve(pckDir, 'node_modules', '.custom-vite');
}

// 加载配置文件
async function resolveConfig () {
    return {
        // 项目根目录
        root: normalizePath(process.cwd()),
        // 入口
        entryPoints: [nodePath.resolve('index.html')],
        // 用于当生成预构建文件后的存储目录，这里我们固定写死为当前项目所在的 node_modules 下的 .custom-vite 目录。
        cacheDir: findNearestPackageData(normalizePath(process.cwd())),
    }
}

export default resolveConfig;
