figma.parameters.on("input", onInput);
figma.on("run", onRun);

function onInput({ parameters, key, query, result }) {
  let percentage = parseInt(query);
  if (percentage < 10) percentage *= 10;
  percentage /= 100;

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
    result.setSuggestions([percentageToString(percentage)]);
  }
}

function onRun({ parameters }) {
  // console.log({ command, parameters });

  const percentage =
    !parameters || !parameters.percentage
      ? getRandomPercentage()
      : parseInt(parameters.percentage) / 100;

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
  const percentageString = percentageToString(percentage);
  figma.notify(
    `Selected ${newLength} of ${originalLength} layers. About ${percentageString}`
  );

  figma.closePlugin();
}

function getRandomPercentage() {
  // bound the random number to 0.2-0.8, to avoid selecting 95%
  const boundedRandom = Math.random() * 0.6 + 0.2;
  return Math.round(boundedRandom * 100) / 100;
}

// convert 0.02 => "02%"
function percentageToString(percentage) {
  const zero = percentage < 0.1 ? "0" : "";
  const percent100 = Math.round(percentage * 100);
  return `${zero}${percent100}%`;
}
