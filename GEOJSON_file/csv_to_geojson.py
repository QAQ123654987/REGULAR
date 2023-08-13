### 參考：https://stackoverflow.com/questions/47308984/how-to-use-python-with-pandas-exporting-data-to-geojson-for-google-map
import pandas
import geojson
from geojson import Feature, FeatureCollection, Point

import os

### 核心要做的事情 讀取來源路徑的csv檔案 轉成 geojson檔案存入 指定的目的路徑
def csv_to_geojson(src_path, dst_path):
    ### 用 panda讀取 CSV
    datas = pandas.read_csv(src_path)

    ### 用 Pint() 建立 一堆feature() 存進 features
    features = datas.apply(
        lambda row: Feature(geometry   = Point( ( float(row['X']), float(row['Y']) ) ),), axis=1).tolist()

    ### 用 features 建立 feature_collection
    feature_collection = FeatureCollection(features=features)

    ### 寫入檔案
    with open(dst_path, 'w', encoding='utf-8') as f:
        geojson.dump(feature_collection, f)


def dir_csv_to_geojson(src_dir, dst_dir = "./result_dir"):
    if(os.path.isdir(src_dir) is False):
        print("src_dir 不存在，請輸入正確src_dir")
        return

    os.makedirs(dst_dir, exist_ok=True)  ### 如果 dst_dir 不存在，建立一個dst_dir

    ### 把 src_dir 中 檔名含有".csv" 的 檔名抓出來放進 file_names
    file_names = [file_name for file_name in os.listdir(src_dir) if (".csv" in file_name.lower()) ]

    ### 用 file_name 走訪所有 file_names
    for file_name in file_names:
        half_name = file_name.split(".")[0]  ### 取得 file_name 檔名部分
        extd_name = file_name.split(".")[1]  ### 取得 file_name 副檔名，其實可以指定"csv"就好，但我習慣寫得有彈性一點
        src_path = f"{src_dir}/{half_name}.{extd_name}"  ### 拼出 src_path：來源資料夾/檔名.副檔名(csv)
        dst_path = f"{dst_dir}/{half_name}.geojson"      ### 拼出 dst_path：目的資料夾/檔名.副檔名(geojson)
        csv_to_geojson(src_path=src_path, dst_path=dst_path)  ### 核心要做的事情 讀取來源路徑的csv檔案 轉成 geojson檔案存入 指定的目的路徑

src_dir = "GEOJSON_file/data"
dst_dir = "GEOJSON_file/result"
dir_csv_to_geojson(src_dir=src_dir, dst_dir=dst_dir)

### 要注意一下開vscode的地方
### 我先看一下你的專案有沒有怪怪的地方嗎還是要先弄你剛剛說的東西可以看一夏，雖然我不知道有沒有問題