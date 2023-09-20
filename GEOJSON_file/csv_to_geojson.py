### 參考：https://stackoverflow.com/questions/47308984/how-to-use-python-with-pandas-exporting-data-to-geojson-for-google-map
import pandas
import geojson
from geojson import Feature, FeatureCollection, Point

import os

import numpy as np
import time
import keyboard
import threading

def check_csv_have_header_and_do_things(src_path):
    '''
    檢查 src_path 指定的CSV 有沒有 header 與 代表 longitude 與 latitude 的文字是什麼
        沒有 的話: 幫他補齊header(已詢問第一行為"Y", 第二行為"X"), 並指定 longitude的文字為 "X", latitude的文字為 "Y"
        有   的話: 檢查 header 第一欄 是不是空的, 是空的用 "INDEX"文字 補齊

    return
        datas, longitude_name, latitude_name
    '''
    datas = pandas.read_csv(src_path)  ### 讀取CSV， 不管有沒有header
    headers = datas.columns            ### 把 header 抓出來等等檢查
    have_header_flag = False           ### 用來標記 目前的CSV 有沒有header, 預設用False, 檢查的過程中有發現header 就設True
    longitude_name = ""                ### 用來記住 header 中 哪個欄位 紀錄 經度(x, longitude)
    latitude_name = ""                 ### 用來記住 header 中 哪個欄位 紀錄 緯度(y, latitude)

    ### 掃過 目前所有 headers, 只要裡面存在 x, y, lon開頭, lat開頭 的 header, 我們就算這個CSV 有header存在
    ### 如果有 header 存在, 順便紀錄 longitude_name 和 longitude_name 分別是用哪些文字表達, 舉例 longitude_name 可能就有 "LON", "Lon", "Longitude", "LONGTITUDE", ... 之類的
    for header in headers:
        if( ("lon" in header[:3].lower()) or
            ("lat" in header[:3].lower()) or
            ("x"   in header    .lower() and len(header) == 1) or
            ("y"   in header    .lower() and len(header) == 1) ):
            have_header_flag = True

        if  ( ("lon" in header[:3].lower()) or
              ("x"   in header    .lower() and len(header) == 1)):
            longitude_name = header

        elif( ("lat" in header[:3].lower()) or
            ("y"   in header    .lower() and len(header) == 1)):
            latitude_name  = header

    ### 走到這裡, 如果 have_header_flag 被設成 True 代表此CSV有 header
    if(have_header_flag is True):
        if(datas.columns[0] == "Unnamed: 0"):
            datas.columns = ["INDEX"] + list(datas.columns[1:])
        return datas, longitude_name, latitude_name

    ### 走到這裡, 如果 have_header_flag 仍為False, 代表沒機會被設成 True, 代表此CSV 沒有 header
    else:
        ### header 抓成待處理的數值, 要把數值抓出來放入待處理的資料堆裡 並把 header放上正確的文字
        ### 已詢問目前的狀況沒有header就一定是兩行, 第一行是"Y", 第二行是"X", 具體做的事情如下:
        ###     step1.header數值抓出來,
        ###     step2.替換成正確的header
        ###     step3.抓出來的數值append進datas
        first_row = {"Y": float(datas.columns[0]), "X": float(datas.columns[1])}  ### 先把 dataframe 的 header 數字 抓出來
        datas.columns  = ["Y", "X"]                                               ### 再把 dataframe 的 header 替換成 想要的的文字
        datas = datas.append(first_row, ignore_index=True)                        ### 把 header抓出來的數字 append 進去 datas
        # print(datas)  ### 看一下結果對不對

        latitude_name  = "Y"
        longitude_name = "X"
        return datas, longitude_name, latitude_name

def csv_to_geojson(src_path, dst_path):
    datas, longitude_name, latitude_name = check_csv_have_header_and_do_things(src_path)
    datas = datas.replace(np.nan, None)  ### 把 nan 填 None

    features = []
    for index, row in datas.iterrows():
        #################################################################################################################
        ### 建立 Point()物件
        x = row[longitude_name]
        y = row[latitude_name]
        point = Point((x, y))

        # 相當於問chatgpt的這些部分
        #     x = float(row.iloc[5]) if not pandas.isna(row.iloc[5]) else None
        #     y = float(row.iloc[4]) if not pandas.isna(row.iloc[4]) else None
        #     geometry = Point((x, y)),

        #################################################################################################################
        ### 建立 properties字典
        properties = {}
        for header in datas.columns:
            if(header != latitude_name and header != longitude_name):  ### 如果 遇到 longitude 和 latitude 欄位 要跳過, 因為這兩個是 x, y 應該要存在Point()部分, 不應該存在 properties
                properties[header] = row[header]

        # 相當於問chatgpt的這些部分
        #     NUM_value = int(row.iloc[0]) if not pandas.isna(row.iloc[0]) else None
        #     MMSI_value = int(row.iloc[1]) if not pandas.isna(row.iloc[1]) else None
        #     IMO_value = int(row.iloc[2]) if not pandas.isna(row.iloc[2]) else None
        #     SHIP_ID_value = int(row.iloc[3]) if not pandas.isna(row.iloc[3]) else None
        #     SPEED_value = int(row.iloc[6]) if not pandas.isna(row.iloc[6]) else None
        #     HEADING_value = int(row.iloc[7]) if not pandas.isna(row.iloc[7]) else None
        #     COURSE_value = int(row.iloc[8]) if not pandas.isna(row.iloc[8]) else None
        #     STATUS_value = int(row.iloc[9]) if not pandas.isna(row.iloc[9]) else None
        #     TIMESTAMP_value = row.iloc[10] if not pandas.isna(row.iloc[10]) else None
        #     DSRC_value = row.iloc[11] if not pandas.isna(row.iloc[11]) else None
        #     UTC_SECONDS_value = int(row.iloc[12]) if not pandas.isna(row.iloc[12]) else None
        #     properties = {"NUM": NUM_value, "MMSI": MMSI_value, "IMO": IMO_value, "SHIP_ID": SHIP_ID_value, "SPEED": SPEED_value, 
        #                     "HEADING": HEADING_value, "COURSE": COURSE_value, "STATUS": STATUS_value, "TIMESTAMP": TIMESTAMP_value, 
        #                     "DSRC": DSRC_value, "UTC_SECONDS": UTC_SECONDS_value, }

        #################################################################################################################
        ### 建立 Feature物件, 第一個geometry參數 放 Point()物件, 第二個properties參數 放 properties字典
        feature = Feature(
            geometry = point,
            properties = properties
        )

        ### 建立好的 Feature物件 放入 features list 裡面
        features.append(feature)

    ### 孫弘 問 chatgpt的版本
    # for index, row in datas.iterrows():
    #     x = float(row.iloc[5]) if not pandas.isna(row.iloc[5]) else None
    #     y = float(row.iloc[4]) if not pandas.isna(row.iloc[4]) else None
    #     NUM_value = int(row.iloc[0]) if not pandas.isna(row.iloc[0]) else None
    #     MMSI_value = int(row.iloc[1]) if not pandas.isna(row.iloc[1]) else None
    #     IMO_value = int(row.iloc[2]) if not pandas.isna(row.iloc[2]) else None
    #     SHIP_ID_value = int(row.iloc[3]) if not pandas.isna(row.iloc[3]) else None
    #     SPEED_value = int(row.iloc[6]) if not pandas.isna(row.iloc[6]) else None
    #     HEADING_value = int(row.iloc[7]) if not pandas.isna(row.iloc[7]) else None
    #     COURSE_value = int(row.iloc[8]) if not pandas.isna(row.iloc[8]) else None
    #     STATUS_value = int(row.iloc[9]) if not pandas.isna(row.iloc[9]) else None
    #     TIMESTAMP_value = row.iloc[10] if not pandas.isna(row.iloc[10]) else None
    #     DSRC_value = row.iloc[11] if not pandas.isna(row.iloc[11]) else None
    #     UTC_SECONDS_value = int(row.iloc[12]) if not pandas.isna(row.iloc[12]) else None

    #     feature = Feature(
    #         geometry = Point((x, y)),
    #         properties = {"NUM": NUM_value, "MMSI": MMSI_value, "IMO": IMO_value, "SHIP_ID": SHIP_ID_value, "SPEED": SPEED_value, 
    #                     "HEADING": HEADING_value, "COURSE": COURSE_value, "STATUS": STATUS_value, "TIMESTAMP": TIMESTAMP_value, 
    #                     "DSRC": DSRC_value, "UTC_SECONDS": UTC_SECONDS_value, }
    #     )

    ### 用 features list 建立 FeatureCollection() 物件
    feature_collection = FeatureCollection(features=features)

    ### 用 geojson物件 的 .dump() 成員函數 把 feature_collection 寫成文字檔
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

src_dir = "GEOJSON_file/data/have_ship_name"
dst_dir = "GEOJSON_file/result/have_ship_name"

#自動執行
def execute_dir_csv_to_geojson():
    global stop_flag
    global pause_flag
    stop_flag = False
    pause_flag = False 
    while not stop_flag:
        while not pause_flag:
            dir_csv_to_geojson(src_dir=src_dir, dst_dir=dst_dir)

geojson_thread = threading.Thread(target=execute_dir_csv_to_geojson)
geojson_thread.start()

while True:
    if keyboard.is_pressed("p"):
        if pause_flag:
            pause_flag = False
            print("繼續運行，按下 'P' 鍵暫停")
        else:
            pause_flag = True
            print("暫停運行，按下 'P' 鍵繼續")
    if keyboard.is_pressed("s"):
        stop_flag = True
        print("停止運行")
        break
    time.sleep(0.1)