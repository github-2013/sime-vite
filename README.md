创建了一个简单的目录文件，同时在 bin/vite 与 package.json 中的 bin 字段进行关联：

```
#!/usr/bin/env node

console.log('hello custom-vite!');
{
"name": "custom-vite",
// ...
"bin": {
"custom-vite": "./bin/vite"
},
// ...
}

```
关于 bin 字段的作用这里我就不再赘述了，此时当我们在本地运行 npm link 后，在控制台执行 custom-vite 就会输出 hello custom-vite!:
