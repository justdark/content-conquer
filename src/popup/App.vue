
<template>
  <div style="width:400px; height:80px">
    <table class="table "  cellpadding="1px" style="width:100%;margin:0px">
  <thead>
    <tr>
      <th>配置项</th>
      <th>值(分号分隔)</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in configItems" >
       <td>{{item.showName}}</td>
      <td><input style="width:100%" v-model="item.value" :placeholder="item.name" :id="item.key"  :text="item.name"></td>
    </tr>
   </tbody>
</table>
<hr style="margin:2px">
<button type="button" v-on:click="saveData" style="width:49%;height:40px">save</button>
<button type="button" v-on:click="closePopups" style="width:49%;height:40px">cancel</button>
<hr style="margin:2px">


    
  </div>
</template>


<script>
import CACConfig from "../CACConfig.json";
import "regenerator-runtime";

export default {
   data() {
    console.log(CACConfig);
    var configItems = CACConfig["configItem"];
    console.log(configItems);
    var outputConfigItem = [];
    var forLocalGet = {}
    for ( var i in configItems){
      var configItem = configItems[i];
      var key = configItem["name"];
      var keys = configItem["keys"];
      console.log(configItem);
      for (var ki=0;ki<keys.length;ki++){
        var uniq_key = key+"_"+keys[ki]["name"]+"_"+keys[ki]["type"];
        outputConfigItem.push({"key":uniq_key,
                                "name":keys[ki]["name"],"value":"",
                                "showName":keys[ki]["showName"]}
                                );
        forLocalGet[uniq_key] = "";
      }
    }
    console.log(forLocalGet);
    
    return {
      msg: 'Welcome to my channel2',

      configItems:outputConfigItem
    }
  },
  methods: {
    init : function(){
          var configItems = CACConfig["configItem"];
          console.log(configItems);
          var outputConfigItem = [];
          var forLocalGet = {}
          for ( var i in configItems){
            var configItem = configItems[i];
            var key = configItem["name"];
            var keys = configItem["keys"];
            console.log(configItem);
            for (var ki=0;ki<keys.length;ki++){
              var uniq_key = key+"_"+keys[ki]["name"]+"_"+keys[ki]["type"];
              outputConfigItem.push({"key":uniq_key,
                                      "name":keys[ki]["name"],"value":""}
                                      );
              forLocalGet[uniq_key] = "";
            }
          }
          var self = this;
          chrome.storage.local.get(forLocalGet, function(item) {
            function getIndex(k,configItems){
              for (var i=0;i<configItems.length;i++){
                if (configItems[i]["key"]==k){
                  return i;
                }
              }
              return -1;
            }
            console.log(item);
            console.log("get item");
            for (var key in item){
              if (item[key].length>0){
                console.log("set value for key "+key+":"+item[key]);
                document.getElementById(key).value = item[key];
                console.log(self.configItems);
                var index = getIndex(key,self.configItems);
                if (index>-1){
                  self.configItems[index]["value"] = item[key];
                }
              }
            }
   
          });
    },
    saveData: function () {
       var forLocalSet = {}
       console.log(this.configItems);
        for (var i=0;i<this.configItems.length;i++){
          console.log(this.configItems[i]);
          console.log("====");
          forLocalSet[this.configItems[i]["key"]] = this.configItems[i]["value"];
        }
        chrome.storage.local.set(forLocalSet, function() {
              console.log(forLocalSet);
              console.log("save success");
            });
        window.close()
    },
    closePopups:function(){
        window.close()
    }
    
  },created: function () {
      this.init();
    }
}

</script>

<style lang="stylus">
</style>
