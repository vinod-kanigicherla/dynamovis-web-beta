import styles from '../LateralPanel.module.css';
import Section from "./Section";


const baseMaps = [
    {
        name: "OpenStreetMap.Mapnik",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        preview: "https://tile.openstreetmap.org/9/85/204.png",
        forCube: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    /*
    {
        name: "MapTilesAPI.OSMEnglish",
        url: "https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key={apikey}"
    }
    */
    {
        name: "OpenTopoMap",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        preview: "https://tile.opentopomap.org/9/85/204.png",
        forCube: "https://tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    {
        name: "Esri.WorldStreetMap",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/9/204/85",
        forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "Esri.WorldTopoMap",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/9/204/85",
        forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "Esri.WorldImagery",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/9/204/85",
        forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "Esri.WorldTerrain",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
        preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/9/204/85",
        forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
    },
    // {
    //     name: "Esri.WorldPhysical",
    //     url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
    //     preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/9/204/85",
    //     forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
    // },
    // {
    //     name: "Esri.OceanBasemap",
    //     url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",
    //     preview: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/9/204/85",
    //     forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}"
    // },
    {
        name: "Esri.NatGeoWorldMap",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
        preview: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/9/204/85",
        forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "Esri.WorldGray\nCanvas",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        preview: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/9/204/85",
        forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "CartoDB.Positron",
        url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        preview: "https://b.basemaps.cartocdn.com/light_all/9/85/204@2x.png",
        forCube: "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
    },
    {
        name: "CartoDB.Positron\nNoLabels",
        url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
        preview: "https://b.basemaps.cartocdn.com/light_nolabels/9/85/204@2x.png",
        forCube: "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png"
    },
    {
        name: "CartoDB.DarkMatter",
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        preview: "https://b.basemaps.cartocdn.com/dark_all/9/85/204@2x.png",
        forCube: "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
    },
    {
        name: "CartoDB.Voyager",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        preview: "https://b.basemaps.cartocdn.com/rastertiles/voyager/9/85/204@2x.png",
        forCube: "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png"
    },
    {
        name: "CartoDB.Voyager\nNoLabels",
        url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
        preview: "https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/9/85/204@2x.png",
        forCube: "https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png"
    },
    {
        name: "USGS.USTopo",
        url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
        preview: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/9/204/85",
        forCube: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "USGS.USImagery",
        url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}",
        preview: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/9/204/85",
        forCube: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
    },
    {
        name: "USGS.\nUSImageryTopo",
        url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}",
        preview: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/9/204/85",
        forCube: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}"
    }
]

const BackgroundSection = (props) => {
    return <div id={styles.BaseMapSelector}>
        <h1 className='text-2xl'>Basemaps</h1>
        <div className={styles.baseMapsContainer}>
            {
                baseMaps.map((possibleMap, i) => {
                    return <div key={i} className={styles.baseMapContainer} onClick={() => props.setBaseMap(possibleMap)}>
                        <img src={possibleMap.preview}/>
                        <p>{possibleMap.name}</p>
                    </div>
                })
            }
        </div>
    </div>
}

export default BackgroundSection;