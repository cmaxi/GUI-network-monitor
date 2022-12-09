const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    openFile: () => ipcRenderer.invoke('openFiledial'),  //open dialog file
    send: (channel, data) => {  //render to main activate fnc in main with data from face
        // whitelist channels
        let validChannels = ["toMain_jslo","toMain_jssa", "toMain_sett"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
            console.log("%c  -" + channel +  " send", 'color:green')//transfer log
        }
        else {console.log("%c  -" + channel + " is not in whitelist of send", 'color:red')}
    },
    receive: (channel, func) => {//main to render just send data 
        // whitelist channels
        let validChannels = ["fromMain_jslo","html_req", "http_logs", "html_req_status","http_responseSumary", "html_req_from_time", "fromMain_sett"];
        console.log("%c  -" + channel + " recieve", 'color:green')  //transfer log
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.once(channel, (event, ...args) => func(...args));
        }
        else {console.log("%c  -" + channel + " is not in whitelist of recieve", 'color:red')}
    },
    receive_cmd: (channel, func) => {//main to render just send data 
        // whitelist channels
        let validChannels = ["fromMain_showhide"];
        console.log("%c  -" + channel + " recieve_cmd", 'color:green')  //transfer log
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
        else {console.log("%c  -" + channel + " is not in whitelist of recieve_cmd", 'color:red')}
    },
    html_req: async(channel, reqValues)=>{
        let validChannels = ["load_html_req","add_html_req","dell_html_req","dellall_html_req","update_html_req","pause_html_req","load_html_req_status","load_html_ResponseSumary", "load_html_req_from_time"];
        console.log("%c  -" + channel + " html request send", 'color:green')  //transfer log
        if (validChannels.includes(channel)) {
            await ipcRenderer.invoke(channel,reqValues)
        }
        else {console.log("%c  -" + channel + " is not in whitelist of recieve", 'color:red')}
    },
});