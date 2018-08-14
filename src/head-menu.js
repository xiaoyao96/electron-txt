import { app } from 'electron'
export const menus = [
    {
        label: '文件',
        submenu:[
            {
                label: '保存',
                click() {
                    console.log('保存')
                },
                accelerator: 'CmdorCtrl+S'
            },
            {
                label: '另存为'
            },
            {
                label: '退出',
                click() {
                    app.exit();
                },
                accelerator: 'CmdorCtrl+Q'
            }

        ]
    },
    {
        label: '查看',
        submenu: [

        ]
    }
]



