import './index.styl'
import CACConfig from "../CACConfig.json";
var configItems = CACConfig["configItem"];
// console.log(configItems);
var outputConfigItem = [];
var forLocalGet = {}
var pageInfoExtract = {}
var valideIndex = [];

var currentUrl = location.href.replace("http://","").replace("https://","");
// console.log("currentUrl:"+currentUrl);
function extractPageInfo(paths,index,element){
    var rst = [];
    if (index==0){
        var list = element.querySelectorAll(paths[0]);
        // console.log(paths[0]);
        // console.log(list);
        for (var i=0;i<list.length;i++){
            var item = extractPageInfo(paths,index+1,list[i]);
            if (item!=null){
                rst.push({node:list[i],value:item});
            }
        }
    } else {
        var conditions = paths[index].split("#");
        var subItems = element.querySelectorAll(conditions[0]);
        var newElement = null;
        if (subItems!=null){
            if (conditions.length>1){
                newElement = subItems[parseInt(conditions[1])];
            } else {
                newElement = subItems[0]
            }
        }
        if (newElement==null){
            return null;
        }
        if (index+1==paths.length){
            return newElement.innerText;
        } else {
            return extractPageInfo(paths,index+1,newElement);
        }
        
    }
    return rst;
}
window.addEventListener ("load", loadToInject, false);

function loadToInject (evt) {
    // console.log(evt);
    for ( var i in configItems){
        var configItem = configItems[i];
        var key = configItem["name"];
        var keys = configItem["keys"];
        var urls = configItem["urls"];
        // console.log(configItem);
        // console.log(urls);
        for (var ui=0;ui<urls.length;ui++){
            var urlRe = new RegExp(urls[ui]);
            if (urlRe.test(currentUrl)){
                for (var ki=0;ki<keys.length;ki++){
                    var uniq_key = key+"_"+keys[ki]["name"]+"_"+keys[ki]["type"];
                    outputConfigItem.push({"key":uniq_key,
                                            "name":keys[ki]["name"],"value":""}
                                            );
                    forLocalGet[uniq_key] = "";
                    var pathList = keys[ki]["path"];
                    // console.log(pathList);
                    pageInfoExtract[uniq_key] = []
                    for (var pi=0;pi<pathList.length;pi++){
                        pageInfoExtract[uniq_key] = pageInfoExtract[uniq_key].concat(extractPageInfo(pathList[pi].split("@"),0,document));
                    }
                    
                }
                break;
            }
        }
    }
    
    // console.log(forLocalGet);
    // console.log(pageInfoExtract);
    
    

    chrome.storage.local.get(forLocalGet, function(item) {
        for (var key in item){
            if (item[key].length>0){
                var blackList = item[key].split(";");
                // console.log("blackList:"+blackList);
                var type = key.split("_")[key.split("_").length-1];
                for (var i=0;i<pageInfoExtract[key].length;i++){
                    var hit = false;
   
                    for (var j=0;j<blackList.length;j++){
                        if (blackList[j].length==0){
                            continue;
                        }
                        if (type=="is"){
                            hit = blackList[j].toLowerCase()==pageInfoExtract[key][i]["value"].toLowerCase()
                        } else {
                            hit = pageInfoExtract[key][i]["value"].toLowerCase().indexOf(blackList[j].toLowerCase())!=-1;
                        }

                        if (hit){
                            pageInfoExtract[key][i]["node"].remove();
                            console.log("remove "+pageInfoExtract[key][i]["value"]);
                            break;
                        }
                    }
                }
            }
    
            
        }
    });

    
}


document.addEventListener("DOMNodeInserted", loadToInject)
