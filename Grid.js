const Columns = ["Time", "Input", "Filtered", "Freq", "Gain", "Phase"];
const container = document.getElementById("ResultTable");
const grid = new Handsontable(container, {
    data: [[]],
    //rowHeaders: true,
    colHeaders: Columns,
    minCols: Columns.length,
    colWidths: 75,
    cells: function (row, col, prop)
    {
        const cellProperties = {};
        const value = this.instance.getDataAtCell(row, col);

        if (value < 0)
        {
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties)
            {
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                td.style.color = 'red';
            };
        }

        return cellProperties;
    },
    readOnly: true,
    licenseKey: "non-commercial-and-evaluation",
});

function DrawGrid(gridData)
{
    grid.updateSettings({
        data: gridData,
    });
}