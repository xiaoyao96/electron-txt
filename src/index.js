import { ipcRenderer, remote } from 'electron' //remote
import fs from 'fs'
const { Menu, MenuItem, dialog, getCurrentWindow } = remote;
let textArea = document.getElementById('textarea');
const contextMenu=Menu.buildFromTemplate([
    { role: 'undo', label: '撤销' },       //Undo菜单项
    { role: 'redo', label: '取消撤销' },       //Redo菜单项
    { type: 'separator' },  //分隔线
    { role: 'cut', label: '剪切' },        //Cut菜单项
    { role: 'copy', label: '复制' },       //Copy菜单项
    { role: 'paste', label: '粘贴' },      //Paste菜单项
    { role: 'delete', label: '删除' },     //Delete菜单项
    { type: 'separator' },  //分隔线
    { role: 'selectall', label: '全选' }   //Select All菜单项
]);
textArea.focus();
document.title = "Notepad - Untitled";
textArea.addEventListener('contextmenu', (e)=>{
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
});

let isSave = true;
textArea.addEventListener('input', e => {
    isSave = false;
    if(currentFile){
        document.title = "Notepad - " + currentFile.split('\\').pop() + ' *'
    }else{
        document.title = "Notepad - Untitled *";
    }
})

let currentFile = '';
ipcRenderer.on('action',(event, arg) => {
    switch (arg){
        case 'new':
            saveFirst().then(_ => {
                document.title = "Notepad - Untitled";
                currentFile = '';
                isSave = true;
                textArea.value = '';
            })
            break;
        case 'open':
            saveFirst().then(_ => {
                const files = dialog.showOpenDialog(getCurrentWindow(), {
                    title: '选择一个文件',
                    filters: [
                        { name: "Text Files", extensions: ['txt', 'js', 'html', 'md', 'css'] },
                        { name: 'All Files', extensions: ['*'] } ],
                    properties: ['openFile']
                });
                if(files && files[0]){
                    isSave = true;
                    var txt = fs.readFileSync(files[0], 'utf-8');
                    currentFile = files[0];
                    document.title = "Notepad - " + currentFile.split('\\').pop();
                    textArea.value = txt;
                }
            })

            // console.log(files)
            break;
        case 'save':
            if(currentFile && !isSave){
                isSave = true;
                fs.writeFileSync(currentFile, textArea.value, 'utf-8');
                document.title = "Notepad - " + currentFile.split('\\').pop();
            }
            if(!currentFile && !isSave){
                dialog.showSaveDialog(getCurrentWindow(), {
                    title: '另存为',
                    filters: [
                        {
                            name: 'HTML', extensions: ['html']
                        },
                        {
                            name: 'CSS', extensions: ['css']
                        },
                        {
                            name: 'TXT', extensions: ['txt']
                        },
                        {
                            name: 'MD', extensions: ['md']
                        }
                    ]
                },res => {
                    if(res){
                        isSave = true;
                        currentFile = res;
                        fs.writeFileSync(currentFile, textArea.value, 'utf-8');
                        document.title = "Notepad - " + currentFile.split('\\').pop();
                    }
                })
            }
            break;
        case 'exit':
            saveFirst().then(_ => {
                getCurrentWindow().close();
            })
            break;
    }
})

function saveFirst() {
    return new Promise(resolve => {
        if(!isSave){
            dialog.showMessageBox(getCurrentWindow(), {
                options: 'warning',
                buttons: ['保存', '不保存', '取消'],
                defaultId: 0,
                title: '提示',
                message: currentFile ? '是否将更改保存到\n' + currentFile  : '您当前文件尚未保存，是否保存文件？',
                cancelId: 1,
                noLink: true
            }, res => {
                if(res === 0){
                    if(currentFile && !isSave){
                        isSave = true;
                        fs.writeFileSync(currentFile, textArea.value, 'utf-8');
                        document.title = "Notepad - " + currentFile.split('\\').pop();
                        resolve();
                    }
                    if(!currentFile && !isSave){
                        dialog.showSaveDialog(getCurrentWindow(), {
                            title: '另存为',
                            filters: [
                                {
                                    name: 'HTML', extensions: ['html']
                                },
                                {
                                    name: 'CSS', extensions: ['css']
                                },
                                {
                                    name: 'TXT', extensions: ['txt']
                                },
                                {
                                    name: 'MD', extensions: ['md']
                                }
                            ]
                        },res => {
                            if(res){
                                isSave = true;
                                currentFile = res;
                                fs.writeFileSync(currentFile, textArea.value, 'utf-8');
                                document.title = "Notepad - " + currentFile.split('\\').pop();
                                resolve();
                            }
                        })
                    }
                }
                else if(res === 1){
                    resolve();
                }
            })
        }else{
            resolve();
        }
    })
}

function save() {

}



