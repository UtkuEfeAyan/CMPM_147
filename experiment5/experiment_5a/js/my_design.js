/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
  return [
    {
      name: "Lunch atop a Skyscraper", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/lunch-on-a-skyscraper.jpg?v=1714798266994",
      credit: "Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932"
    },
    {
      name: "Train Wreck", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/train-wreck.jpg?v=1714798264965",
      credit: "Train Wreck At Monteparnasse, Levy & fils, 1895"
    },
    {
      name: "Migrant mother", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/migrant-mother.jpg?v=1714778906791",
      credit: "Migrant Mother near Nipomo, California, Dorothea Lange, 1936"
    },
    {
      name: "Disaster Girl", 
      assetUrl: "https://cdn.glitch.global/3abd0223-86fb-43ce-a00a-fde12615bcd5/girl-with-fire.jpg?v=1714778905663",
      credit: "Four-year-old Zoë Roth, 2005"
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  inspiration.image.loadPixels();

  // Creates a design with a dense list of small transparent circles based on the inspiration image
  let design = [];
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height);
    let ix = Math.floor(x * 4);
    let iy = Math.floor(y * 4);
    let idx = 4 * (iy * inspiration.image.width + ix);
    let imgPixels = inspiration.image.pixels;
    let colorFromImg = [
      imgPixels[idx],
      imgPixels[idx + 1],
      imgPixels[idx + 2],
      random(160, 255)
    ];
    design.push({
      x: x,
      y: y,
      r: random(3, 8),
      color: colorFromImg
    });
  }
  return design;
}

function renderDesign(design, inspiration) {
  background(240);
  noStroke();
  for (let circle of design) {
    fill(circle.color);
    ellipse(circle.x, circle.y, circle.r * 2);
  }
}

function mutateDesign(design, inspiration, rate) {
  function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
  }

  for (let circle of design) {
    circle.x = mut(circle.x, 0, width, rate);
    circle.y = mut(circle.y, 0, height, rate);
    circle.r = mut(circle.r, 1, 10, rate);

    let ix = Math.floor(circle.x * 4);
    let iy = Math.floor(circle.y * 4);
    let idx = 4 * (iy * inspiration.image.width + ix);
    let imgPixels = inspiration.image.pixels;
    circle.color[0] = mut(imgPixels[idx], 0, 255, rate);
    circle.color[1] = mut(imgPixels[idx + 1], 0, 255, rate);
    circle.color[2] = mut(imgPixels[idx + 2], 0, 255, rate);
    circle.color[3] = mut(circle.color[3], 60, 150, rate);
  }

}
