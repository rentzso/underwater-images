# using data from http://www.naturalearthdata.com/
# following tutorial https://bost.ocks.org/mike/map/
ogr2ogr   -f GeoJSON -clipdst "POLYGON((-63.5 19, -60.5 19, -60.5 12, -63.5 12, -63.5 19))" -clipsrc "POLYGON((-63.5 19, -60.5 19, -60.5 12, -63.5 12, -63.5 19))" coastline.json ne_10m_coastline.shp
topojson -o coastline_obj.json -- coastline.json
ogr2ogr   -f GeoJSON -clipdst "POLYGON((-63.5 19, -60.5 19, -60.5 12, -63.5 12, -63.5 19))" -clipsrc "POLYGON((-63.5 19, -60.5 19, -60.5 12, -63.5 12, -63.5 19))" places.json ne_10m_populated_places.shp
topojson -o coastline_obj.json --properties name=NAME -- coastline.json places.json
