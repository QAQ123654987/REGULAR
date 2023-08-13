var map = L.map('map',{center:[23.973, 120.979], zoom: 8});
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
var bigmap = L.tileLayer(osmUrl,{attribution: attribution}).addTo(map);
//var miniosm = L.tileLayer(osmUrl,{attribution: attribution});   
//var miniMap = L.Control.MiniMap(miniosm, {
//  toggleDisplay: true,  // 在主地圖上顯示/隱藏迷你地圖
//  minimized: false      // 初始化時是否最小化迷你地圖
//}).addTo(map);

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

// 創建一個空的數組用於管理boat圖層
var boatLayers = []

//創立群聚效果圖層
var boat_20230709_layer = L.markerClusterGroup();
var boat_20230719_layer = L.markerClusterGroup();

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
    }).addTo(boat_20230709_layer);//將標記放到圖層
      boatLayers.push(boat_20230709_layer);//將圖層放到數組控制
});

$.getJSON("GEOJSON_file/result/S1A_IW_GRDH_1SDV_20230719T100158_20230719T100223_049491_05F383_EF64.geojson", function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
          // 使用自定義圖示創建標記
          var boat_20230719_marker = L.marker(latlng, { icon: customIcon });

          return boat_20230719_marker;
      }
    }).addTo(boat_20230719_layer);
      boatLayers.push(boat_20230719_layer);
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
    var option2 = L.DomUtil.create("option", "", select);
    var option3 = L.DomUtil.create("option", "", select);
    option1.innerHTML = "選擇日期"
    option2.setAttribute('value', "boat_20230719"); option2.innerHTML = "2023-07-19"
    option3.setAttribute('value', "boat_20230709"); option3.innerHTML = "2023-07-09"

    
    // var checkfunction = function(){
    //     if(image_check.checked && month_02_radio.checked) {KongHouse.addTo(map);}
    //     else {map.removeLayer(KongHouse)}
    //     }
        
    var checkfunction_for_select = function(){

      // 移除舊的圖層
        for (var i = 0; i < boatLayers.length; i++) {
          map.removeLayer(boatLayers[i]);
      }

      // 根據選擇的值顯示相應的圖層
      if( select.value === 'boat_20230719') {
        boatLayers[1].addTo(map);
        boat_check.checked = true
      }
      else if (select.value === 'boat_20230709') {
        boatLayers[0].addTo(map);
        boat_check.checked = true
      }
    }

    var checkfunction_for_checkbox = function(){
      if(boat_check.checked){
        checkfunction_for_select()
      }
      else{
        for (var i = 0; i < boatLayers.length; i++) {
          map.removeLayer(boatLayers[i]);
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