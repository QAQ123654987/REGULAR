var map = L.map('map',{center:[23.973, 120.979], zoom: 8});
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
var bigmap = L.tileLayer(osmUrl,{attribution: attribution}).addTo(map);

//創建迷你視窗
var miniosm = new L.tileLayer(osmUrl);   
var miniMap = new L.Control.MiniMap(miniosm ,{
 toggleDisplay: true,  // 在主地圖上顯示/隱藏迷你地圖
 minimized: false      // 初始化時是否最小化迷你地圖
}).addTo(map);

//創建畫畫工具
var drawItem = new L.FeatureGroup();
        map.addLayer(drawItem);
                var option = {
            position: 'topleft',
            collapsed: true,
            edit: {
                featureGroup: drawItem,
            },
        };
        var drawControl = new L.Control.Draw(option);
        map.addControl(drawControl);
    
    // ###################################################################################################
    

    // ###################################################################################################
    
// 創建 管理GEOJSON檔案群集圖層(markerClusterGroup)物件 放入 {}
var boatLayers = {}
var boatLayers_AIS = {}
var dates =[
            "2023-08-12",         
            "2023-08-02",
            "2023-07-19",
            "2023-07-09",
            "2023-07-07",
            "2023-06-27",
            "2023-06-25",
            "2023-06-15",
          ]
for (var i = 0; i < dates.length; i++){
  var date =  dates[i]
  var year  = date.substring(0,  4)
  var month = date.substring(5,  7)
  var day   = date.substring(8, 10)
  boatLayers[`${year}${month}${day}`] =  L.markerClusterGroup();
  boatLayers_AIS[`${year}${month}${day}`] =  L.markerClusterGroup();
  }

// 自定義boat圖示
var customIcon = L.icon({
  iconUrl: 'ICON/boat_icon.png',  // 替換為你的圖示圖片的URL
  iconSize: [16, 16],  // 設定圖示的尺寸
});

// 載入 boat GEOJSON 檔案
$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230709T215231_20230709T215300_049352_05EF48_8724.geojson", function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          // 使用自定義圖示創建標記
          var boat_20230709_marker = L.marker(latlng, { icon: customIcon });

          return boat_20230709_marker;
      }
    }).addTo(boatLayers["20230709"]);//將標記放到圖層
      //將圖層放到數組控制
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230719T100104_20230719T100133_049491_05F383_3076_exp7.geojson", function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          // 使用自定義圖示創建標記
          var boat_20230719_marker = L.marker(latlng, { icon: customIcon })

          return boat_20230719_marker;
      }
    }).addTo(boatLayers["20230719"]);
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230719T100133_20230719T100158_049491_05F383_61E2_exp7.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });//對，其實可以把東西打上1.2.3就好

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230719"]);
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230719T100158_20230719T100223_049491_05F383_EF64_exp7.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230719"]);
    
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230802T215232_20230802T215301_049702_05FA08_064B.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230802"]);
    
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230802T215301_20230802T215326_049702_05FA08_A199.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230802"]);
    
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230802T215326_20230802T215351_049702_05FA08_4CA9.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230802"]);
    
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230812T100105_20230812T100134_049841_05FE86_18CD_exp7.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230812"]);
    
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230812T100134_20230812T100159_049841_05FE86_F648_exp7.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230812"]);
    
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230812T100159_20230812T100224_049841_05FE86_3EA7_exp7.geojson", function(data) {
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        // 使用自定義圖示創建標記
        var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

        return boat_20230719_marker;
    }
  }).addTo(boatLayers["20230812"]);
    
});

L.Control.KongButtons = L.Control.extend({
  options: { position: 'topright' ,
           },
  
  onAdd: function (map) {
    var container = L.DomUtil.create('div'    , 'leaflet-control-layers leaflet-control leaflet-control-layers-expanded');
    var container = L.DomUtil.create('div'    , 'leaflet-control-layers leaflet-control leaflet-control-layers-expanded');
    // var container = L.DomUtil.create('div'    , 'leaflet-control-layers leaflet-control leaflet-control-layers');
    container.setAttribute('aria-haspopup', true);

    var a_tag     = L.DomUtil.create("a"      , "leaflet-control-layers-toggle", container); // leaflet-control-layers-toggle 會有 圖層 的icon 自動產生
    a_tag.href="#";  // 為了讓 button 滑鼠過去 會變小手手 會有可以按的感覺
    a_tag.title="Layers";
    a_tag.role = "button";
    var section   = L.DomUtil.create("section", "leaflet-control-layers-list", container)
    
    // ###################################################################################################
    

    // ###################################################################################################

    var layerover = L.DomUtil.create("div"    , "leaflet-control-layers-overlays", section)
    // ###
    var image_label = L.DomUtil.create("label", "", layerover)
    var image_span  = L.DomUtil.create("span" , "", image_label)
    var image_check = L.DomUtil.create('input', 'leaflet-control-layers-selector', image_span); image_check.type     = "checkbox";
    var image_span  = L.DomUtil.create('span' , ''                               , image_span); image_span.innerHTML = "影像";
    
    var boat_label = L.DomUtil.create("label", "", layerover)
    var boat_span  = L.DomUtil.create("span" , "", boat_label)
    var boat_check = L.DomUtil.create('input', 'leaflet-control-layers-selector', boat_span); boat_check.type     = "checkbox";
    var boat_span  = L.DomUtil.create('span' , ''                               , boat_span); boat_span.innerHTML = "船隻";

    var select  = L.DomUtil.create("select", "", section);
    
    var option1 = L.DomUtil.create("option", "", select);
    option1.innerHTML = "選擇日期"

    //創建日期選項
    for(var i = 0; i < dates.length; i++) {
      var date = dates[i]
      var year  = date.substring(0,  4)
      var month = date.substring(5,  7)
      var day   = date.substring(8, 10)
      var option = L.DomUtil.create("option", "", select);
      option.innerHTML = dates[i]
      option.setAttribute('value', `${year}${month}${day}`);
    }
    console.log("select.value")
    console.log("select.value", typeof select.value)
    console.log("select.value", select.value.length)
    // var option = L.DomUtil.create("option", "", select);
    // var option = L.DomUtil.create("option", "", select);
    // var option = L.DomUtil.create("option", "", select);
    // option2.innerHTML = "2023-07-19"
    // option2.setAttribute('value', "boat_20230719");

    // option3.innerHTML = "2023-07-09"
    // option3.setAttribute('value', "boat_20230709"); 
    
    // var option5 = L.DomUtil.create("option", "", select);
    // var option6 = L.DomUtil.create("option", "", select);
    // var option7 = L.DomUtil.create("option", "", select);


    // option4.innerHTML = "2023-07-07"
    // option5.innerHTML = "2023-06-27"
    // option6.innerHTML = "2023-06-25"
    // option7.innerHTML = "2023-06-15"   

    // var checkfunction = function(){
    //     if(image_check.checked && month_02_radio.checked) {KongHouse.addTo(map);}
    //     else {map.removeLayer(KongHouse)}
    //     }
        
    // 紀錄 select 上次按的選項，移除圖層的時候會用到
    var last_option = "選擇日期"
    

    var checkfunction_for_select = function(){
      console.log("here")
      console.log(select.value)


      // // 移除舊的圖層
      if(last_option !== "選擇日期") {
        map.removeLayer(boatLayers[last_option]);
      }
      //   for (var i = 0; i < boatLayers.length; i++) {
      //     map.removeLayer(boatLayers[i]);
      // }
      
      boatLayers[select.value].addTo(map);
      boat_check.checked = true

      last_option = select.value        
    }

    var checkfunction_for_checkbox = function(){
      if(boat_check.checked){
        // checkfunction_for_select()
        if(last_option !== "選擇日期") {
        boatLayers[select.value].addTo(map);
        }
      }
      else{
        if(last_option !== "選擇日期") {
          map.removeLayer(boatLayers[last_option]);
        }
      }
    }

    // 參考 https://stackoverflow.com/questions/64046196/i%C2%B4m-stucked-creating-a-new-leaflet-custom-control
    L.DomEvent.on(boat_check, 'click' , checkfunction_for_checkbox);
    L.DomEvent.on(select    , 'change', checkfunction_for_select);
    // L.DomEvent.on(container, 'click', checkfunction);
    // 參考 leaflet官網上下載下來的javascript：https://leafletjs.com/download.html，用 ctrl+f 搜 stopPropagation
    L.DomEvent.on(container, 'mousedown touchstart dblclick contextmenu', L.DomEvent.stopPropagation);
    L.DomEvent.on(container, 'wheel', L.DomEvent.stopPropagation);


    return container;
        },
        onRemove: function (map) {},
        
    });
    var control3 = new L.Control.KongButtons()
    control3.addTo(map);
    
    // ###################################################################################################
    

    // ###################################################################################################
    
//回到地圖中央
var zoom_to_taiwan = L.easyButton({
      states: [
        {
          stateName: "default-state",
          icon: 'fa-share',
          title: "Zoom to Taiwan", // 在這裡設定提示文字
          onClick: function(btn, map) {
            map.setView([23.973, 120.979], 8);
          }
        }
      ]
    }).addTo(map);

//顯示滑鼠所在處經緯度
let latlng = L.control();
latlng.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'latlng');
    this.update();
    return this._div;
};

latlng.update = function(latlng) {
    if (latlng) {
        this._div.innerHTML = '緯度：' + latlng.lat.toFixed(4) + '<br>經度：' +
            '' +
            '' +
            '' + latlng.lng.toFixed(4);
    }
};
latlng.addTo(map);
    
map.on('mousemove', function(e) {
    latlng.update(e.latlng);
});