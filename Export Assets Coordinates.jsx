function getLayerCoordinates(layer, groupName) {
    var bounds = layer.bounds; // [left, top, right, bottom]
    var x = bounds[0].as('px'); // Left position
    var y = bounds[1].as('px'); // Top position
    return { name: layer.name, x: x, y: y, group: groupName };
}
function processLayers(layers, groupName, output) {
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var layerName = layer.name.toString().toLowerCase(); // Convert to string & lowercase
        // Check if the name contains ".png"
        if (layerName.indexOf(".png") !== -1) {
            var coords = getLayerCoordinates(layer, groupName);
            output.push(coords.name + " - X: " + coords.x + ", Y: " + coords.y);
        }
        // If the layer is a group (LayerSet), process its contents
        if (layer.typename === "LayerSet") {
            processLayers(layer.layers, layer.name, output);
        }
    }
}
// Function to save results to a text file
function saveToFile(output) {
    var file = new File("~/Desktop/LayerCoordinates.txt"); // Save to Desktop
    file.open("w");
    file.write(output.join("\n"));
    file.close();
    alert("Coordinates saved as 'LayerCoordinates.txt' on your Desktop.");
}
var doc = app.activeDocument;
var output = [];
processLayers(doc.layers, "Root", output);
// If matching layers are found, show a dialog with "Save" and "OK" buttons
if (output.length > 0) {
    var dialog = new Window("dialog", "Assets Coordinates - *.png", undefined, { resizeable: true });
    dialog.preferredSize = [400, 640]; // Set dialog size to px
    dialog.alignChildren = "center";
    var message = dialog.add("statictext", undefined, "Exported Data:");
    message.alignment = "center";
    var resultText = dialog.add("edittext", undefined, output.join("\n"), { multiline: true, readonly: true, scrollable: true });
    resultText.preferredSize = [400, 640]; // Make the text box large to fit the dialog
    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    var saveButton = buttonGroup.add("button", undefined, "Save");
    var okButton = buttonGroup.add("button", undefined, "OK");
    saveButton.onClick = function () {
        saveToFile(output);
        dialog.close();
    };
    okButton.onClick = function () {
        dialog.close();
    };
    dialog.show();
} else {
    alert("No layers or groups containing '.png' found.");
}