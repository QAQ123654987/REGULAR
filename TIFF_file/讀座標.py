import rasterio

# 打开 GeoTIFF 文件
with rasterio.open('TEST.tif') as dataset:
    # 获取左上角坐标和右下角坐标
    left, top = dataset.transform * (0, 0)
    right, bottom = dataset.transform * (dataset.width, dataset.height)

print("左下角坐标 (左经度, 下纬度):", left, bottom)
print("右上角坐标 (右经度, 上纬度):", right, top)
