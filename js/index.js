(function() {

    const width = 960;
    const height = 500;
    let statesLivedData = [];
    let citiesLivedData = [];
    let statesGeoJSONData = [];
    window.onload = function() {
        // load states lived data
        d3.csv("data/stateslived.csv")
            .then((data) => {
                statesLivedData = data;
                loadCitiesData()
            });
    }

    // load cities data
    function loadCitiesData() {
        d3.csv("data/cities-lived.csv")
            .then((data) => {
                citiesLivedData = data;
                loadStatesGeoJSONData();
            });
    }

    // load GeoJSON states data
    function loadStatesGeoJSONData() {
        d3.json("data/countries.geojson").then((data) => {
            statesGeoJSONData = data
            makeMapPlot(); // all data should be loaded
        });
    }

    function makeMapPlot() {
        /*
        console.log(statesLivedData);
        console.log(citiesLivedData);
        console.log(statesGeoJSONData);
        */
        // define the projection type we want
        let projection = d3.geoNaturalEarth1()
            .translate([width/2, height/2]) // translate to center of svg
            //.scale([1000]); // scale down to see the whole US
        
        // path generator
        let path = d3.geoPath() // converts geoJSON to SVG paths
            // each state is represented by a path element
            .projection(projection); // use AlbersUSA projection

        let color = d3.scaleLinear()
            .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);
    
        let legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];
        
        let svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        // append a div to the body for the tooltip
        let tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        
        color.domain([0,1,2,3]);
        
        // Loop through each state data value in the .csv file
        for (let i = 0; i < statesLivedData.length; i++) {

            // Grab State Name
            let dataState = statesLivedData[i].state;

            // Grab data value 
            let dataValue = statesLivedData[i].visited;

            // Find the corresponding state inside the GeoJSON
            for (let j = 0; j < statesGeoJSONData.features.length; j++)  {
                let jsonState = statesGeoJSONData.features[j].properties.name;

                if (dataState == jsonState) {

                // Copy the data value into the JSON
                statesGeoJSONData.features[j].properties.visited = dataValue; 

                // Stop looking through the JSON
                break;
                }
            }
        }
        console.log(statesGeoJSONData);   

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(statesGeoJSONData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", function(d) {

            // Get data value
            var value = d.properties.visited;

            if (value) {
                //If value exists…
                return color(value);
            } else {
                //If value is undefined…
                return "rgb(213,222,217)";
            }
        });

        
    }
})();