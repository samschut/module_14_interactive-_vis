// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let info = metadata.filter(x => x.id == sample)[0]; // note the ==

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a for loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    for (const [key, value] of Object.entries(info)) {
      panel.append("h6").text(`${key}: ${value}`);
    }
  });
}


// function to build charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples 
    let sample_data = data.samples;

    // Filter samples for the object with the desired sample number
    let info = sample_data.filter(x => x.id === sample)[0];
    console.log(info);

    // Get the otu_ids, otu_labels, and sample_values from the dataset
    let otu_ids = info.otu_ids;
    let otu_labels = info.otu_labels;
    let sample_values = info.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "tropic"
      },
      text: otu_labels
      };

    let bubble_traces = [bubble_trace];

    // Make Bubble Chart with x and y axis labels and title
    let bubble_layout = {
      title: 'Bacterial Cultures per Sample',
      xaxis: { title: 'OTU ID'},
      yaxis: { title: 'Number of Bacteria'}
    };

    Plotly.newPlot('bubble', bubble_traces, bubble_layout);


    // Bar Chart
    let bar_y = otu_ids.map(x => `OTU: ${x}`);
    console.log(bar_y);

    // Build a Bar Chart
    let trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: bar_y.slice(0, 10).reverse(),
      type: 'bar',
      marker: {
        colorscale: "icefire",
        color: sample_values.slice(0, 10).reverse()
      },
      text: otu_labels.slice(0, 10).reverse(),
      orientation: 'h'
    };


    // Render the Bar Chart
    let traces = [trace1];

     // Apply a title and x and y axis labels
    let layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: 'Number of Bacteria'},
      yaxis: { title: 'OTU ID'}
    };

    // make plot to the div tag with id 
    Plotly.newPlot("bar", traces, layout);

  });
}

// Function to run page
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    console.log(data);

    // Get the names 
    let names = data.names;

    // Use d3 to select the dropdown 
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_name = names[0];
    console.log(default_name);

    // Build charts and metadata panel with the first sample
    buildCharts(default_name);
    buildMetadata(default_name);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
