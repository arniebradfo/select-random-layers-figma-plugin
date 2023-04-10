figma.parameters.on("input", onInput);
figma.on("run", onRun);

function onInput({ result }) {
  // console.log({ parameters, key, query, result });

  // TODO: validate number here instead, provide as single suggestion
  
  result.setSuggestions([]); // freeform
}

function onRun({ parameters }) {
  // console.log({ command, parameters });

  // validate number
  const percentage = parseInt(parameters.percentage) / 100;

  if (figma.currentPage.selection.length === 0) {
    figma.notify("Nothing Selected");
  } else if (typeof percentage !== "number" || isNaN(percentage)) {
    figma.notify("Input not a number. Selection unchanged.");
  } else if (percentage <= 0) {
    figma.currentPage.selection = [];
    figma.notify("Input was less than 0%. Selected nothing.");
  } else if (percentage >= 1) {
    figma.notify("Input was greater than 100%. Selection unchanged.");
  } else {
    if (
      figma.currentPage.selection.length === 1 &&
      figma.currentPage.selection[0].children != null
    ) {
      // if the selection is a single element with children, sub-select the children instead
      figma.currentPage.selection = figma.currentPage.selection[0].children;
    }

    const originalLength = figma.currentPage.selection.length;
    figma.currentPage.selection = figma.currentPage.selection.filter(
      (node) => Math.random() < percentage
    );
    const newLength = figma.currentPage.selection.length;
    const percent100 = percentage * 100;
    figma.notify(
      `Selected ${newLength} of ${originalLength} layers. About ${percent100}%`
    );
  }

  figma.closePlugin();
}
