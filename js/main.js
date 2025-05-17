// Hint: This is a great place to declare your global variables
var female_data = [];
var male_data = [];
var svg;
const width = 1050;
const height = 500;
const margin = 30;
var key;
var x;
var gYAxis;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
    
   // This will load your CSV files and store them into two arrays.
    Promise.all([
        d3.csv('data/females_data.csv', (d) => {
            return {
                cote: (+d['Cote d\'Ivoire'])*100,
                lao: (+d['Lao'])*100,
                montenegro: (+d['Montenegro'])*100,
                papua: (+d['Papua New Guinea'])*100,
                united: (+d['United States'])*100,
                year: new Date(+d['Year'], 0, 1)
            };
        }),
        d3.csv('data/males_data.csv', (d) => {
            return {
                cote: (+d['Cote d\'Ivoire'])*100,
                lao: (+d['Lao'])*100,
                montenegro: (+d['Montenegro'])*100,
                papua: (+d['Papua New Guinea'])*100,
                united: (+d['United States'])*100,
                year: new Date(+d['Year'], 0, 1)
            };
        })
    ])
    .then(function (values) {
        console.log('Loaded the females_data.csv and males_data.csv');
        female_data = values[0];
        male_data = values[1];

        // Hint: This is a good spot for data wrangling

        drawLolliPopChart();
    });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {

    key = document.getElementById('country_dropdown').value.split(' ')[0].toLowerCase();

    //create svg tag
    svg = d3.select('#myDataVis')
        .append('svg')
            .attr('width', width + margin + margin)
            .attr('height', height + margin + margin)
            .attr('style', 'margin:30px 0px');

    //create x-axis
    x = d3.scaleTime()
            .domain([new Date(1990,0,1),new Date(2023,0,1)])
            .range([margin, width-margin*2]);
    
    let xAxis = d3.axisBottom(x)
                    .ticks(d3.timeYear.every(5))
                    .tickFormat(d3.timeFormat("%Y"));

    svg.append('g')
        .attr('transform', `translate(${margin*2},${height})`)
        .call(xAxis);

    svg.append('text')
        .text('Year')
        .attr('x', width/2)
        .attr('y', height+margin+15);
    
    //create y-axis
    gYAxis = svg.append('g')
        .attr('class', 'gYAxis')
        .attr('transform', `translate(${margin*3}, ${margin})`);

    svg.append('text')
        .text('Employment Rate (%)')
        .attr('transform', `translate(${margin+10}, ${(height/2)+margin}), rotate(-90)`)
        .attr('text-anchor', 'middle');

    //add legends
    svg.append('g')
        .attr('transform', `translate(${width-(margin*10)}, ${margin-10})`)
        .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', '#007bae');

    svg.append('text')
        .text('Male Employement Rate')
        .attr('transform', `translate(${width+20-(margin*10)}, ${margin-10+13})`);

    svg.append('g')
        .attr('transform', `translate(${width-(margin*10)}, ${margin-10+30})`)
        .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', '#e0218a');

    svg.append('text')
        .text('Female Employement Rate')
        .attr('transform', `translate(${width+20-(margin*10)}, ${margin-10+13+30})`);

    drawDynamicSections();
}

function drawDynamicSections(){

    key = document.getElementById('country_dropdown').value.split(' ')[0].toLowerCase();
    let maxYAxisValue = getMaxYAxisValue(key);
    if(maxYAxisValue < 100){
        maxYAxisValue += 5;
    }

    //create y-axis
    let y = d3.scaleLinear()
            .domain([maxYAxisValue,0])
            .range([margin,height-margin]);

    let yAxis = d3.axisLeft(y);

    gYAxis.transition()
        .duration(1000)
        .call(yAxis);

    //plot female_data line
    let femaleLine = svg.selectAll('.female-line')
        .data(female_data);
    
    femaleLine.enter()
        .append('g')
        .append('line')
        .merge(femaleLine)
            .transition()
            .duration(1000)
            .attr('class', 'female-line')
            .attr('x1', d => x(d['year']))
            .attr('y1', d => y(d[key]))
            .attr('x2', d => x(d['year']))
            .attr('y2', height-margin)
            .attr('transform', `translate(${(margin*2)+5}, ${margin})`)
            .attr('stroke', '#e0218a');

    //plot female_data circle
    let femaleCircle = svg.selectAll('.female-circle')
        .data(female_data);

    femaleCircle.enter()
        .append("circle")
        .merge(femaleCircle)
            .transition()
            .duration(1000)
            .attr('class', 'female-circle')
            .attr("cx", d => x(d['year']))
            .attr("cy", d => y(d[key]))
            .attr("r", "4")
            .attr('transform', `translate(${(margin*2)+5},${margin})`)
            .style("fill", "#e0218a");

    //plot male_data line

    let maleLine = svg.selectAll('.male-line')
        .data(male_data);
    
    maleLine.enter()
        .append('g')
        .append('line')
        .merge(maleLine)
            .transition()
            .duration(1000)
            .attr('class', 'male-line')
            .attr('x1', d => x(d['year']))
            .attr('y1', d => y(d[key]))
            .attr('x2', d => x(d['year']))
            .attr('y2', height-margin)
            .attr('transform', `translate(${(margin*2)-5}, ${margin})`)
            .attr('stroke', '#007bae');

    //plot male_data circle
    let maleCircle = svg.selectAll('.male-circle')
        .data(male_data);

    maleCircle.enter()
        .append("circle")
        .merge(maleCircle)
            .transition()
            .duration(1000)
            .attr('class', 'male-circle')
            .attr("cx", d => x(d['year']))
            .attr("cy", d => y(d[key]))
            .attr("r", "4")
            .attr('transform', `translate(${(margin*2)-5},${margin})`)
            .style("fill", "#007bae");
}

function getMaxYAxisValue(key){

    let maxValue = 0;

    female_data.forEach(element => {
        if(element[key] > maxValue){
            maxValue = element[key]
        }
    });

    male_data.forEach(element => {
        if(element[key] > maxValue){
            maxValue = element[key]
        }
    });

    return maxValue;
}

