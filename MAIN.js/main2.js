var map = L.map('map', { center: [23.973, 120.979], zoom: 8 });
var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
var bigmap = L.tileLayer(osmUrl, { attribution: attribution }).addTo(map);

//創建迷你視窗
var miniosm = new L.tileLayer(osmUrl);
var miniMap = new L.Control.MiniMap(miniosm, {
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

//設定抓取文件路徑
const GeoJSONboatfilesPath    = 'GEOJSON_file/result/';
const GeoJSONboatfilesAISPath = 'GEOJSON_file/result/have_ship_name/';
fetch('GEOJSON_file/result/')
  .then(response => response.text())
  .then(data => {
    //console.log("data", data);
    // 用 DOMParser 來解析 fetch到的 HTML， 變成 可操作的物件
    const parser  = new DOMParser();
    const htmlDoc = parser.parseFromString(data, 'text/html');
    console.log("htmlDoc", htmlDoc);

    // 獲取所有a_tags（通常是文件名）
    let a_tags_all  = htmlDoc.querySelectorAll('a');
    console.log("a_tags_all", a_tags_all);
    a_tags_all      = Array.from(a_tags_all);
    //console.log("a_tags_all_array", a_tags_all);
    a_tags_you_want = a_tags_all.slice(3)
    // console.log("a_tags_you_want", a_tags_you_want);
    // console.log("a_tag", a_tags_you_want);
    // console.log("a_tag", a_tags_you_want[0].getElementsByTagName("span")[0].textContent);
    // console.log("a_tag", a_tags_you_want[1].getElementsByTagName("span")[0].textContent);
    // console.log("a_tag", a_tags_you_want[2].getElementsByTagName("span")[0].textContent);
    // console.log("a_tag", a_tags_you_want[3].getElementsByTagName("span")[0].textContent);
    // console.log("a_tag", a_tags_you_want[4].getElementsByTagName("span")[0].textContent);

    let GeoJSONboatfileNames_withoutfilter = a_tags_you_want.map(a_tag => a_tag.getElementsByTagName("span")[0].textContent);
    // console.log("GeoJSONboatfileNames_withoutfilter", GeoJSONboatfileNames_withoutfilter);

    // 過濾出你想要的文件名，例如只獲取以 '.geojson' 结尾的文。件名
    let GeoJSONboatfileNames = GeoJSONboatfileNames_withoutfilter.filter(GEOfileName => GEOfileName.endsWith('.geojson'));
    // console.log("GeoJSONboatfileNames", GeoJSONboatfileNames);
    console.log("GeoJSONboatfileNames", GeoJSONboatfileNames);
    // 創建 管理GEOJSON檔案群集圖層(markerClusterGroup)物件 放入 {}
    var boatLayers          = {}
    var boatLayers_AIS      = {}
    var boatLayers_MATCH = {}
    var dates               = []
    GeoJSONboatfileNames.forEach( function (fileName_fordates) {
      // 提取日期部分（從位置17到25）, fileName的長相: S1A_IW_GRDH_1SDV_20230719T100133_20230719T100158_049491_05F383_61E2_exp7
      if (fileName_fordates.toLowerCase().endsWith(".geojson") && fileName_fordates.startsWith("20")) {
        var yearpart   = fileName_fordates.substring(0, 4);
        var monthpart  = fileName_fordates.substring(4, 6);
        var daypart    = fileName_fordates.substring(6, 8);
        const datePart = `${yearpart}-${monthpart}-${daypart}`

        // 如果日期不在 dates 數组中，則添加
        if (!dates.includes(datePart)) {
          dates.push(datePart);
        }
      }
    });
    // 現在 dates 數组包含不重複的日期
    dates.reverse();
    console.log(dates);

    //創建圖層
    for (var i = 0; i < dates.length; i++) {
      var date  = dates[i]
      var year  = date.substring(0,  4)
      var month = date.substring(5,  7)
      var day   = date.substring(8, 10)
      boatLayers    [`${year}${month}${day}`]      = L.markerClusterGroup();
      boatLayers_AIS[`${year}${month}${day}`]      = L.markerClusterGroup();
      boatLayers_MATCH[`${year}${month}${day}`]    = L.markerClusterGroup();
    }

    // 自定義boat圖示
    var customIcon  = L.icon({
      iconUrl: 'ICON/boat_icon.png',  // 替換為你的圖示圖片的URL
      iconSize: [16, 16],  // 設定圖示的尺寸
    });

    var customIcon2 = L.icon({
      iconUrl: 'ICON/AIS_icon.png',  // 替換為你的圖示圖片的URL
      iconSize: [16, 16],  // 設定圖示的尺寸
    });

    var customIcon3 = L.icon({
      iconUrl: 'ICON/match_icon.png',  // 替換為你的圖示圖片的URL
      iconSize: [16, 16],  // 設定圖示的尺寸
    });

    ///////////////////////////////////////////////////////////////////////////////
    // 把處理好的資料用 jQuery 的 $.getJSON 函數運作並 把產出的點位 根據日期 放到圖層上
    // 再把圖層存到 boat_geoJSON{} 裡面
    // 第一個參數要丟處理好可給$.getJSON讀取的路徑，第二個參數丟檔案名稱
    function processGeoJSONFile(filePath, fileName) {
      // 使用 $.getJSON 載入並處理 GEOJSON 檔案
      if (fileName.toLowerCase().includes("ais")) {
        $.getJSON(filePath, function (data) {
        var boat_geoJSON = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            // 使用自定義圖標創建標記
              var temp_mark = L.marker(latlng, { icon: customIcon2 }).bindPopup("<div style='text-align: center;'>--船名--<br>" + feature.properties.MMSI + "</div>");
              return temp_mark;
            }
          })
          boat_geoJSON.addTo(boatLayers_AIS[`${fileName.substring(0, 8)}`]);
      });
      }
      else if (fileName.toLowerCase().includes("match")) {
        $.getJSON(filePath, function (data) {
          var boat_geoJSON = L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
              var temp_polygon = L.polygon(feature.geometry.coordinates);
              // point 是 先丟y再丟x, 跟 polygon相反！ 所以先把 point1,2 的 x, y 抓出來, 再正確的用 y, x 來建立 marker
              point1x = feature.geometry.coordinates[0][0][0]
              point1y = feature.geometry.coordinates[0][0][1]
              point3x = feature.geometry.coordinates[0][2][0]
              point3y = feature.geometry.coordinates[0][2][1]
              L.marker([point1y, point1x], { icon: customIcon2 }).addTo(boatLayers_MATCH[`${fileName.substring(0, 8)}`]);
              L.marker([point2y, point2x], { icon: customIcon2 }).addTo(boatLayers_MATCH[`${fileName.substring(0, 8)}`]);
              return temp_polygon;
            }
          });

          boat_geoJSON.addTo(boatLayers_MATCH[`${fileName.substring(0, 8)}`]);
        });
      }
      else {
        $.getJSON(filePath, function (data) {
        var boat_geoJSON = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            // 使用自定義圖標創建標記
              var temp_mark = L.marker(latlng, { icon: customIcon }).bindPopup("<div style='text-align: center;'>--船名--<br>" + feature.properties.MMSI + "</div>");
              return temp_mark;
            }
          })
          boat_geoJSON.addTo(boatLayers[`${fileName.substring( 17, 25)}`]);
      });
      }
    }

    // 把數組內容做成可給GEOJSON插件運作的樣式，並拿去"函式GeoJSONboatfilesPath"執行。
    // 第一個要丟內容為.geojson檔名的數組，第二個要丟資料夾相對路徑
    function processGeoJSONFiles(files, relative_path) {
      // 遍歷文件列表
      files.forEach(function (file) {
        if (file.endsWith('.geojson')) {
          //設定$.getJSON讀取的路徑
          const GeoJSONfilePath = `${relative_path}${file}`;
          console.log("GeoJSONfilePath", GeoJSONfilePath)
          processGeoJSONFile(GeoJSONfilePath, `${file}`);
        }
      });
    }

    // 調用處理文件的函数
    console.log("GeoJSONboatfileNames", GeoJSONboatfileNames)
    console.log("GeoJSONboatfilesPath", GeoJSONboatfilesPath)
    processGeoJSONFiles(GeoJSONboatfileNames, GeoJSONboatfilesPath);

    // 走到這裡 會把 boatLayers, boatLayers_AIS 的 Cluster圖層物件 都依據 日期 把 資料點 放入 相應日期的Cluster圖層物件中 囉～
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  一些 KongButtons 和 slider 會共用到的一些 變數 和 function 都拉到最上面
    let last_option = "選擇日期";                // 紀錄 select 上次按的選項，移除圖層的時候會用到， 因為 boat 和 ais 的日期一定會一樣， 所以不需要 分 boat_last_option 和 ais_last_option
    let shared_maxClusterRadius = 80;           // 給所有Layer 共用的 cluster群聚半徑
    
    let update_cluster_layer = function (processedLayer) {
      temp = L.markerClusterGroup();                            // 建立一個 新的暫存Cluster
      temp.addLayer(processedLayer);                            // 把 現在的Cluster資料 加進去 暫存Cluster
      temp.options.maxClusterRadius = shared_maxClusterRadius;  // 設定 暫存Cluster 的 Cluster半徑
      map.removeLayer(processedLayer);                          // 把 原本的Cluster 從地圖上拿掉
      temp.addTo(map);                                          // 把 暫存的Cluster 放上地圖
      return temp;                                              // 把原本Cluster 更新成 暫存Cluster
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //創建按鈕
    L.Control.KongButtons = L.Control.extend({
      options: {
        position: 'topright',
      },

      onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control leaflet-control-layers-expanded');
        var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control leaflet-control-layers-expanded');
        // var container = L.DomUtil.create('div'    , 'leaflet-control-layers leaflet-control leaflet-control-layers');
        container.setAttribute('aria-haspopup', true);

        var a_tag   = L.DomUtil.create("a", "leaflet-control-layers-toggle", container); // leaflet-control-layers-toggle 會有 圖層 的icon 自動產生
        a_tag.href  = "#";  // 為了讓 button 滑鼠過去 會變小手手 會有可以按的感覺
        a_tag.title = "Layers";
        a_tag.role  = "button";
        var section = L.DomUtil.create("section", "leaflet-control-layers-list", container)

        // ###################################################################################################


        // ###################################################################################################

        var layerover = L.DomUtil.create("div", "leaflet-control-layers-overlays", section)
        // ###
        // var image_label = L.DomUtil.create("label", "", layerover)
        // var image_span = L.DomUtil.create("span", "", image_label)
        // var image_check = L.DomUtil.create('input', 'leaflet-control-layers-selector', image_span); image_check.type = "checkbox";
        // var image_span = L.DomUtil.create('span', '', image_span); image_span.innerHTML = "影像";

        var boat_label     = L.DomUtil.create("label", "", layerover)
        var boat_span      = L.DomUtil.create("span", "", boat_label)
        var boat_check     = L.DomUtil.create('input', 'leaflet-control-layers-selector', boat_span); boat_check.type = "checkbox";
        var boat_span      = L.DomUtil.create('span', '', boat_span); boat_span.innerHTML = "船隻";

        var ais_label      = L.DomUtil.create("label", "", layerover)
        var ais_span       = L.DomUtil.create("span", "", ais_label)
        var ais_check      = L.DomUtil.create('input', 'leaflet-control-layers-selector', ais_span); ais_check.type = "checkbox";
        var ais_span       = L.DomUtil.create('span', '', ais_span); ais_span.innerHTML = "AIS";

        var match_label    = L.DomUtil.create("label", "", layerover)
        var match_span     = L.DomUtil.create("span", "", match_label)
        var match_check    = L.DomUtil.create('input', 'leaflet-control-layers-selector', match_span); match_check.type = "checkbox";
        var match_span     = L.DomUtil.create('span', '', match_span); match_span.innerHTML = "船隻&AIS";

        // var ais_label = L.DomUtil.create("label", "", layerover)
        // var ais_span = L.DomUtil.create("span", "", ais_label)
        // var ais_check = L.DomUtil.create('input', 'leaflet-control-layers-selector', ais_span); ais_check.type = "checkbox";
        // var ais_span = L.DomUtil.create('span', '', ais_span); ais_span.innerHTML = "AIS";

        var select  = L.DomUtil.create("select", "", section);

        var option1 = L.DomUtil.create("option", "", select);
        option1.innerHTML = "選擇日期"

        //創建日期選項
        for (var i = 0; i < dates.length; i++) {
          var date   = dates[i]
          var year   = date.substring(0, 4)
          var month  = date.substring(5, 7)
          var day    = date.substring(8, 10)
          var option = L.DomUtil.create("option", "", select);
          option.innerHTML = dates[i]
          option.setAttribute('value', `${year}${month}${day}`);
        }
        console.log("select.value")
        console.log("select.value", typeof select.value)
        console.log("select.value", select.value.length)


        // 給 checkbox 和 下拉式選單select 用的， 檢查 兩者的狀態 做 相對應的事情
        var check_status_of_select_and_checkbox_then_do_things = function () {
          console.log("check_status_of_select_and_checkbox_then_do_things~~~~~");
          
          // checkbox 打勾 要做的事情:
          var checked_do_things = function (processedLayers) {
            var processedLayer
            // 移除上次的圖層， 但上次有可能是選擇 "選擇日期"， "選擇日期"沒有圖層不能刪， 所以 checkbox 打勾時 如果 last_option 遇到 "選擇日期" 要跳過
            console.log("checked_do_things~~~~~");
            console.log("last_option", last_option);
            console.log("select.value", select.value);
            if (last_option !== "選擇日期") {
              console.log("remove last option:", last_option);
              map.removeLayer(processedLayers[last_option]);
            }

            // 顯示現在的boat圖層， 也是有可能選到 "選擇日期"， "選擇日期"沒有圖層不能加， 所以 checkbox 打勾時 如果 select.value 遇到 "選擇日期" 要跳過
            if (select.value !== "選擇日期") {
              console.log("add select.value to map:", select.value);
              processedLayers[select.value].addTo(map);
              
              console.log("update select.value cluster:", select.value);
              processedLayers[select.value] = update_cluster_layer(processedLayer = processedLayers[select.value]);
            }

            // 上次的圖層 更新為 現在的圖層，給下次的選項刪除此次的圖層
            last_option = select.value;

            // 因為 javascript 是 call by sharing, 我在過程中又有 把processedLayers的內容 賦予新的物件 且 我想保存這個操作, 所以就把操作結果return 回去讓外面接這樣子囉～
            return processedLayers
          }
          
          // checkbox 沒打勾勾了 要做的事情:
          var unchecked_do_things = function (processedLayers) {
            console.log("unchecked_do_things~~~~~");
            console.log("last_option", last_option);
            console.log("select.value", select.value);
            // 如果 checkbok 沒打勾勾了， 以下做 checkbox 沒打勾勾了 要做的事情:
            if (last_option !== "選擇日期") {
              console.log("unchecked last_option", last_option);
              map.removeLayer(processedLayers[last_option]);
            }
            
            // 因為 javascript 是 call by sharing, 我在過程中又有 把processedLayers的內容 賦予新的物件 且 我想保存這個操作, 所以就把操作結果return 回去讓外面接這樣子囉～
            return processedLayers
          }

          // 如果 船隻 checkbok 打勾/沒打勾 要做的事情
          if (boat_check.checked)     { boatLayers =   checked_do_things(processedLayers = boatLayers)}
          else                        { boatLayers = unchecked_do_things(processedLayers = boatLayers)}

          // 如果 船隻ais checkbok 打勾/沒打勾 要做的事情
          if (ais_check.checked)      { boatLayers_AIS =   checked_do_things(processedLayers = boatLayers_AIS)}
          else                        { boatLayers_AIS = unchecked_do_things(processedLayers = boatLayers_AIS)}
        
          if (match_check.checked) { boatLayers_MATCH =   checked_do_things(processedLayers = boatLayers_MATCH)}
          else                        { boatLayers_MATCH = unchecked_do_things(processedLayers = boatLayers_MATCH)}
        }

        // 參考 https://stackoverflow.com/questions/64046196/i%C2%B4m-stucked-creating-a-new-leaflet-custom-control
        L.DomEvent.on(boat_check     , 'click' , check_status_of_select_and_checkbox_then_do_things);
        L.DomEvent.on(ais_check      , 'click' , check_status_of_select_and_checkbox_then_do_things);
        L.DomEvent.on(match_check , 'click' , check_status_of_select_and_checkbox_then_do_things);
        L.DomEvent.on(select         , 'change', check_status_of_select_and_checkbox_then_do_things);
        // L.DomEvent.on(container, 'click', checkfunction);
        // 參考 leaflet官網上下載下來的javascript：https://leafletjs.com/download.html，用 ctrl+f 搜 stopPropagation
        L.DomEvent.on(container      , 'mousedown touchstart dblclick contextmenu', L.DomEvent.stopPropagation);
        L.DomEvent.on(container      , 'wheel' , L.DomEvent.stopPropagation);

        return container;
      },
      onRemove: function (map) { },
      
    });
    var control3 = new L.Control.KongButtons()
    control3.addTo(map);
    
    // ###################################################################################################
    // slider小工具, 用來控制 Cluster的群聚半徑
    L.control.slider(
      // slider 第一個參數放 function， 此function 在 slider 改變值後會被執行， 且 此function 規定一定會被丟一個參數放slider的數值(這個參數可以自己命名)
      function (slider_value) {
        shared_maxClusterRadius = slider_value;

        // 對這邊來說 last_option 是 目前的 select 選項中的選項喔～
        // 如果 目前的選項 不是 "選擇日期"， 那就 
        if (last_option !== "選擇日期") {
          boatLayers[last_option]          = update_cluster_layer(boatLayers    [last_option]);
          boatLayers_AIS[last_option]      = update_cluster_layer(boatLayers_AIS[last_option]);
        }
      },
 
      // slider 第二個參數放 slider 的 options, 參數可參考 https://github.com/Eclipse1979/leaflet-slider
      { 
        max: 61,  // slider最大值
        min: 0.01,
        value: 60,  // slider初始值
        step: 1,    // slider移動一格的值
        size: '250px',
        orientation: 'horizontal',
        id: 'slider',
        logo: "C",
        syncSlider: false  // 滑動的過程中 要不要同步改變值
      }).addTo(map);
    // ###################################################################################################

  })

//回到地圖中央
var zoom_to_taiwan = L.easyButton({
  states: [
    {
      stateName: "default-state",
      icon: 'fa-share',
      title: "Zoom to Taiwan", // 在這裡設定提示文字
      onClick: function (btn, map) {
        map.setView([23.973, 120.979], 8);
      }
    }
  ]
}).addTo(map);

//顯示滑鼠所在處經緯度
let latlng = L.control();
latlng.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'latlng');
  this.update();
  return this._div;
};

latlng.update = function (latlng) {
  if (latlng) {
    this._div.innerHTML = '緯度：' + latlng.lat.toFixed(4) + '<br>經度：' +
      '' +
      '' +
      '' + latlng.lng.toFixed(4);
  }
};
latlng.addTo(map);

map.on('mousemove', function (e) {
  latlng.update(e.latlng);
});

L.layerGroup()

