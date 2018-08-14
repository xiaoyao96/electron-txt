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
textArea.addEventListener('contextmenu', (e)=>{
    e.preventDefault();
    contextMenu.popup(remote.getCurrentWindow());
});

ipcRenderer.on('action',(event, arg) => {
    switch (arg){
        case 'new':
            document.title = "Notepad - Untitled";
            break;
        case 'open':
            const files = dialog.showOpenDialog(getCurrentWindow(), {
                title: '选择一个文件',
                filters: [
                    { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] },
                    { name: 'All Files', extensions: ['*'] } ],
                properties: ['openFile']
            });
            if(files[0]){
                var txt = fs.readFileSync(files[0], 'utf8');
                textArea.value = txt;
            }
            // console.log(files)
            break;
    }
})



