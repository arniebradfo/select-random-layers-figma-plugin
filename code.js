figma.parameters.on("input", onInput);
figma.on("run", onRun);

function onInput({ parameters, key, query, result }) {
  const percentage = parseInt(query) / 100;

  // console.log({ parameters, key, query, result, percentage });

  if (figma.currentPage.selection.length === 0) {
    result.setLoadingMessage("No Layers Selected...");
  } else if (!query) {
    result.setSuggestions([]);
  } else if (typeof percentage !== "number" || isNaN(percentage)) {
    result.setLoadingMessage("Input must be a number");
  } else if (percentage <= 0) {
    result.setLoadingMessage("Input must be more than 0%");
  } else if (percentage >= 1) {
    result.setLoadingMessage("Input must be less than 100%");
  } else {
    const zero = percentage < 0.1 ? "0" : "";
    const percent100 = percentage * 100;
    result.setSuggestions([`${zero}${percent100}%`]);
  }
}

function onRun({ parameters }) {
  // console.log({ command, parameters });

  // validate number
  const percentage = parseInt(parameters.percentage) / 100;

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
  const zero = percentage < 0.1 ? "0" : "";
  const percent100 = percentage * 100;
  figma.notify(
    `Selected ${newLength} of ${originalLength} layers. About ${zero}${percent100}%`
  );

  figma.closePlugin();
}
