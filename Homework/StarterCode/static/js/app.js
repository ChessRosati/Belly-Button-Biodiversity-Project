
var dropdown = d3.select("#selDataset");
d3.json("samples.json").then((tests) => {
    tests.names.forEach( function(n) {
    var d = dropdown.append("option");
        d.text(n);
    });

});



function hbar(id) {

d3.json("samples.json").then((tests) => {
    var individual = tests.samples.filter(sample => sample.id === id)[0];
    var sample_id_dicts = [];

    for (var i = 0; i < individual.sample_values.length; i++) {
        sample_id_dicts.push({
        "id": `OTU ${individual.otu_ids[i]}`,
        "value" : individual.sample_values[i],
        "label": individual.otu_labels[i]
    })};
    
    var sorted = sample_id_dicts.sort(function(a,b) {
        return Object.values(a)[0] > Object.values(b)[0];
    }).slice(0, 10).reverse();


    ids = [];
    values = [];
    labels = [];

    Object.values(sorted).forEach(function(test){
        ids.push(test.id);
        values.push(test.value);
        labels.push(test.label);
    });
    
    var trace1 = {
        y: ids,
        x: values,
        type: "bar",
        orientation: "h",
        text: labels
    };
    var data = [trace1];
    Plotly.newPlot("bar", data);
});
};

function bubble(id) {

    d3.json("samples.json").then((tests) => {
        var individual = tests.samples.filter(sample => sample.id === id)[0];

    var trace1 = {
        x: individual.otu_ids,
        y: individual.sample_values,
        text: individual.otu_labels,
        mode: 'markers',
        marker: {
          color: individual.otu_ids,
          size: individual.sample_values,
        }
      };

    var data = [trace1];

    Plotly.newPlot("bubble", data);
})};

function meta(id) {
    d3.json("samples.json").then((tests) => {
        var individual = tests.metadata.filter(meta => meta.id === id)[0];

    var metadata = d3.select("#sample-metadata");

    metadata.html('');

    Object.entries(individual).forEach(function(m) {
        var text = metadata.append("p")
        .attr("class", "lead")
        .attr("style", "font-weight:500");
        text.text(`${m[0]} : ${m[1]}`);
    });


})};

function update_info() {
    var id = d3.event.target.value;
    meta(Number(id));
    hbar(id);
    bubble(id);
};


d3.selectAll("#selDataset").on("change", update_info);
