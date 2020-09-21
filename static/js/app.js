const dropdown = d3.select("#selDataSet");

function init(){
    d3.json("data/samples.json").then(function(data) {
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value");
        });
    });
};

/**
 * @param {string} selectedSubject
 */
function optionChanged(selectedSubject) {
    console.log("Selection: " + selectedSubject)
    
    fillInfo(selectedSubject);
    makeBarBubblePlots(selectedSubject);
    makeGaugePlot(selectedSubject);  
};

/**
 * @param {string} subjectID 
 */
function fillInfo(subjectID) {
    d3.json("data/samples.json").then((data) => {
        
        const metadataField = d3.select("#sample-metadata");

        var subjectData = data.metadata.filter(s => s.id.toString() === subjectID)[0];
        
        metadataField.html(""); 

        Object.entries(subjectData).forEach((key) => { 
            if (key[1] == null){ 
                metadataField.append("p").text(key[0] + ": No data" + "\n"); 
            }
            else{
                metadataField.append("p").text(key[0] + ": " + key[1] + "\n");
            }
        });
    });
};

/**
 * @param {string} subjectID
 */
function makeBarBubblePlots(subjectID){
    d3.json("data/samples.json").then((data) => {

        console.log(subjectID);

        var sample = data.samples.filter(s => s.id.toString() === subjectID)[0];

        var otuValues = sample.sample_values;
        var otuIDs = sample.otu_ids; 
        var otuLabels = sample.otu_labels; 

        var otuValuesTop10 = otuValues.slice(0,10).reverse();
        var otuIDsTop10 = otuIDs.slice(0,10).reverse().map(id => "OTU: " + id + " ");
        var otuLabelsTop10 = otuLabels.slice(0,10);
        
        console.log("Building bar chart");

        var trace1 = { 
            x: otuValuesTop10,
            y: otuIDsTop10,
            text: otuLabelsTop10,
            type: "bar",
            orientation: "h"
        };

        var data1 = [trace1]; 

        var layout1 = {
            title: "Top 10 OTUs for Test Subject: " + subjectID,
            xaxis: {
                title: "OTU Value"
            }
        };

        console.log("Building bubble chart");

        var trace2 = {
            x: otuIDs,
            y: otuValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: otuIDs,
                size: otuValues
            }
        };

        var data2 = [trace2]; 

        var layout2 = {
            title: 'Bubble Chart',
            showlegend: false,
            width: 1200
        };

        Plotly.newPlot("bar", data1, layout1);

        Plotly.newPlot("bubble", data2, layout2);
    });
};

init();