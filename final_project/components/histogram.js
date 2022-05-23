class Histogram {
    margin = {
        top: 10, right: 10, bottom: 40, left: 40
    }

    constructor(svg, width = 250, height = 250) {
        this.svg = svg;
        this.width = width;
        this.height = height;
    }

    initialize() {
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.xAxis = this.svg.append("g");
        this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleLinear();

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(){
        this.container.selectAll('*').remove();
        this.container = this.svg.append("g");
        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        
        let col = ["PassengerId", "Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked", "scores"];

        const PC_data = {};

        for (var line=0; line<possible_data.length; line++){
            if (possible_data[line]["PassengerId"] == PassengerId){
                if (possible_data[line][col[CellIndex]] != CellValue){
                    PC_data[possible_data[line][col[CellIndex]]] = possible_data[line]["scores"]
                }
            }
        }

        const possible_list = Object.keys(PC_data).map(
            (key) => {return {x:key, y:PC_data[key]}}
        );

        const origin_data = [];

        for (var line=0; line<data.length; line++){
            if (data[line]["PassengerId"] == PassengerId){
                PC_data[data[line][col[CellIndex]]] = data[line]["scores"];
                origin_data.push({x:data[line][col[CellIndex]], y:data[line]["scores"]});
            }
        }

        var items = Object.keys(PC_data).map(
            (key) => {return [key, PC_data[key]] }
        );

        items.sort(
            (first, second) => {return parseFloat(first[0]) - parseFloat(second[0])}
        );

        var keys = items.map(
            (e) => {return e[0]}
        );

        const dot_list = [];

        var yMax = 0.0;
        var yMin = 1.0;

        for (var i=0; i<keys.length; i++){
            dot_list.push({x:keys[i], y:PC_data[keys[i]]});

            if (yMin > PC_data[keys[i]]) {
                yMin = PC_data[keys[i]];
            }

            if (yMax < PC_data[keys[i]]) {
                yMax = PC_data[keys[i]];
            }
        }

        var xMax = dot_list[dot_list.length - 1].x;
        var xMin = dot_list[0].x;

        var range = yMax - yMin;

        yMin = Math.max(0, yMin - 0.1 * range);
        yMax = Math.min(1, yMax + 0.1 * range);

        this.yScale.domain([yMin, yMax]).range([this.height, 0]);

        if (CellIndex == 1 || CellIndex == 3 || CellIndex == 4 || CellIndex == 5 || CellIndex == 6){
            this.xScale = d3.scaleLinear();
            this.xScale.domain([xMin, xMax]).range([0, this.width]);

            const line_i = d3.line()
                .x((d) => this.xScale(d.x))
                .y((d) => this.yScale(d.y));

            this.container.append('path')
                .datum(dot_list)
                .attr('fill', 'none')
                .attr('stroke', 'blue')
                .attr('stroke-width', 1)
                .attr('d', line_i);

            var format = d3.format(".3");

            this.container.append('g')
                .selectAll('text')
                .data(dot_list)
                .enter()
                .append('text')
                .text((d) => format(d.y))
                .attr('x', (d) => this.xScale(d.x))
                .attr('y', (d) => this.yScale(d.y) - 10)
                .attr('fill', 'black')
                .attr('font-family', 'Tahoma')
                .attr('font-size', '12px')
                .attr('text-anchor', 'middle');

            this.container.append('g')
                .selectAll('dot')
                .data(possible_list)
                .enter()
                .append('circle')
                    .attr('fill', 'black')
                    .attr('r', 3)
                    .attr('cx', (d) => this.xScale(d.x))
                    .attr('cy', (d) => this.yScale(d.y));

            this.container.append('g')
                .selectAll('dot')
                .data(origin_data)
                .enter()
                .append('circle')
                    .attr('fill', 'red')
                    .attr('r', 3)
                    .attr('cx', (d) => this.xScale(d.x))
                    .attr('cy', (d) => this.yScale(d.y));

            this.xAxis
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
                .call(d3.axisBottom(this.xScale));

            this.yAxis
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
                .call(d3.axisLeft(this.yScale));

        } else if (CellIndex == 2 || CellIndex == 7){        
            this.xScale = d3.scaleBand();

            const total_data = [...new Set(dot_list.map(d => d.x == "" ? ["None", d.y] : [d.x, d.y]))];
            const possible_data = [...new Set(possible_list.map(d => d.x == "" ? ["None", d.y] : [d.x, d.y]))];
            const original_data = [...new Set(origin_data.map(d => d.x == "" ? ["None", d.y] : [d.x, d.y]))];
            const categories = [...new Set(dot_list.map(d => d.x == "" ? "None" : d.x))];

            const None_index = categories.indexOf("None");

            categories.splice(None_index, 1);
    
            categories.sort();
            categories.push("None");
            
            this.xScale.domain(categories).range([0, this.width]).padding(0.3);
    
            // TODO: draw a histogram
            this.container.append('g')
                .selectAll("rect")
                .data(possible_data)
                .join("rect")
                .attr("x", d => this.xScale(d[0]))
                .attr("y", d => this.yScale(d[1]))
                .attr("width", this.xScale.bandwidth())
                .attr("height", d => this.height - this.yScale(d[1]))
                .attr("fill", "lightgray");

            this.container.append('g')
                .selectAll("rect")
                .data(original_data)
                .join("rect")
                .attr("x", d => this.xScale(d[0]))
                .attr("y", d => this.yScale(d[1]))
                .attr("width", this.xScale.bandwidth())
                .attr("height", d => this.height - this.yScale(d[1]))
                .attr("fill", "red");

            var format = d3.format(".3");

            this.container.append('g')
                .selectAll('text')
                .data(total_data)
                .enter()
                .append('text')
                .text((d) => format(d[1]))
                .attr('x', (d) => this.xScale(d[0]) + this.xScale.bandwidth()/2)
                .attr('y', (d) => this.yScale(d[1]) - 5)
                .attr('fill', 'black')
                .attr('font-family', 'Tahoma')
                .attr('font-size', '12px')
                .attr('text-anchor', 'middle');

            this.xAxis
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
                .call(d3.axisBottom(this.xScale));
    
            this.yAxis
                .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
                .call(d3.axisLeft(this.yScale));
        }

        this.container.append('text')
            .attr("x", (this.width / 2))             
            .attr("y", 10 - (this.margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .text("ID : " + PassengerId);
    }

    clear(){
        this.container.selectAll('*').remove();
        this.svg.axis.tickSizeOuter(0);
    }
}