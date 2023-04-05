const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';


// Function for interactive dropdown menu

function optionChanged(selectedID){

    d3.json(url).then(function(data) {
 //       console.log (data);


// BAR CHART

   // Filter sample data for selected ID

         function dataFiltered (item) {
            return item.id == selectedID;
         }

        let idSample = data.samples.filter(dataFiltered);
         
        // console.log(idSample);

   // sort sample_values in descending order and select the top 10 OTUs  

        let sampleValue = idSample[0].sample_values.sort((a, b) => b - a);
         
        let slicedValues = sampleValue.slice(0, 10).reverse();

        let otuID = idSample[0].otu_ids.slice(0, 10).reverse().map(item => 'OTU' + " " + item);

        let otuLabels = idSample[0].otu_labels.slice(0, 10).reverse();


   // Check values
         // console.log(slicedValues);
         // console.log(otuID);
         // console.log(otuLabels);

    
    // Define the layout and trace object, edit color and orientation

       const trace = {
       y: otuID,
       x: slicedValues,
       type: 'bar',
       orientation: "h",
       text: otuLabels,
       marker: {
          color: 'rgb(65,105,225)',
          width: 1
         }
       };

 
   // Plot using Plotly
      
   Plotly.newPlot('bar', [trace], {responsive: true});    


// BUBBLE CHART 

       let sampleValue1 = idSample[0].sample_values;

       let otuID1 = idSample[0].otu_ids;

       let otuLabels1 = idSample[0].otu_labels;


       const trace1 = {
        x: otuID1,
        y: sampleValue1,
        text: otuLabels1, 
        mode: 'markers',
        marker: {
            color:otuID1,
            size: sampleValue1
        }
       };

        
     // Plot using Plotly
     Plotly.newPlot('bubble', [trace1]);



// INDIVIDUAL'S DEMOGRAPHIC INFORMATION

// Select the metadata array and for each item; append the item ID and adds ID to dropdown
   
   data.metadata.forEach(item =>
   {
    // console.log(item.id);

   d3.select ("#selDataset").append('option').attr('value', item.id).text(item.id);
   });

// Selected value is passed

   d3.select("#selDataset").node().value = selectedID;

// Filter Metadata for selected ID from dropdown

   const idMetadata = data.metadata.filter(item=> (item.id == selectedID));
 //    console.log(item);
 //    console.log(item.id);


// Check the metadata loaded for the selected ID
   // console.log(idMetadata);

const panelDisplay = d3.select("#sample-metadata");
panelDisplay.html("");
Object.entries(idMetadata[0]).forEach(item=> 
 {
    // console.log(item);
    panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
 });


// BONUS: GAUGE CHART

// Gauge Chart to plot weekly washing frequency 
 
const gaugeDisplay = d3.select("#gauge");
 gaugeDisplay.html(""); 
 const washFreq = idMetadata[0].wfreq;
 
 const gaugeData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency </b><br> Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",     
       gauge: {
       axis: { range: [0,9] },
       steps: [
         { range: [0, 1], color: "#ffffff" },
         { range: [1, 2], color: "#e3f9f3" },
         { range: [2, 3], color: "#c7f2e8" },
         { range: [3, 4], color: "#abecdc" },
         { range: [4, 5], color: "#90e6d1" },
         { range: [5, 6], color: "#74e0c5" },
         { range: [6, 7], color: "#58d9ba" },
         { range: [7, 8], color: "#3cd3ae" },
         { range: [8, 9], color: "#2cc29d" }
       ],
       bar: { color: "#710005" },                
       threshold: {
          value: washFreq,
          thickness: 1.5
        }
      }
    }
  ]; 

 
 // Plot using Plotly
  Plotly.newPlot('gauge', gaugeData); 

    });

}


 // Set initial id selection at ID 940
 optionChanged('940');
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selDataset").on('change',() => {
 optionChanged(d3.event.target.value);
 
 });
