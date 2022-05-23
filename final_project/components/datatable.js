class DataTable {
    constructor(id, histogram_id) {
        this.id = id;
        this.histogram_id = histogram_id;
    }

    update(data, columns) {
        let table = d3.select(this.id);

        let rows = table
            .selectAll("tr")
            .data(data)
            .join("tr");

        rows.selectAll("td")
            .data(d => columns.map(c => d[c]))
            .join("td")
            .text(d => d)
            .style("color", function(d){
                if (d=="Survived") {
                    return "rgb(31, 119, 180)";
                } else if (d == "Not Survived") {
                    return "rgb(255, 127, 14)";
                } else {
                    return "black";
                }
            })
            .on("click", function(d) {

                PassengerId = d.path[1].__data__.PassengerId
                CellIndex = d.path[0].cellIndex
                CellValue = d.path[0].__data__

                histogram.update();
                });
    }

}

