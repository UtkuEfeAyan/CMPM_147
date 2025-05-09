/* exported getInspirations, initDesign, renderDesign, mutateDesign */

let generationCounter = 0;


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
    {
      name: "My Cat 1",
      assetUrl: "https://cdn.glitch.global/75f4b9ca-6c85-4e47-83df-feea14331a7a/WhatsApp%20Image%202025-05-08%20at%208.58.24%20PM.jpeg?v=1746773527594",
      credit: "Taken by me / Mr. Gölge"
    },
    {
      name: "My Cat 2",
      assetUrl: "https://cdn.glitch.global/75f4b9ca-6c85-4e47-83df-feea14331a7a/WhatsApp%20Image%202025-05-08%20at%208.58.22%20PM.jpeg?v=1746773538045",
      credit: "Taken by me / Mr. Gölge"
    },
    {
      name: "AI Landscape Art",
      assetUrl: "https://cdn.glitch.global/75f4b9ca-6c85-4e47-83df-feea14331a7a/WhatsApp%20Image%202025-05-08%20at%208.50.03%20PM.jpeg?v=1746773531522",
      credit: "AI image via Adobe Stock"
    },
    {
      name: "Game Screenshot: Prey",
      assetUrl: "https://cdn.glitch.global/75f4b9ca-6c85-4e47-83df-feea14331a7a/WhatsApp%20Image%202025-05-08%20at%208.50.04%20PM.jpeg?v=1746773533802",
      credit: "Steam (Prey © Arkane Studios)"
    }
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 4, inspiration.image.height / 4);
  inspiration.image.loadPixels();

  let design = [];
  for (let i = 0; i < 1000; i++) {
    design.push(randomCircle(inspiration, minCircleSize, maxCircleSize));
  }
  return design;
}

function randomCircle(inspiration, minR, maxR) {
  let x = random(width);
  let y = random(height);
  let ix = Math.floor(x * 4);
  let iy = Math.floor(y * 4);
  ix = constrain(ix, 0, inspiration.image.width - 1);
  iy = constrain(iy, 0, inspiration.image.height - 1);
  let idx = 4 * (iy * inspiration.image.width + ix);
  let imgPixels = inspiration.image.pixels;
  let colorFromImg = [
    imgPixels[idx],
    imgPixels[idx + 1],
    imgPixels[idx + 2],
    Math.floor(random(minAlphaTransparency, maxAlphaTransparency))
  ];
  return {
    x: x,
    y: y,
    r: random(minR, maxR),
    color: colorFromImg
  };
}

function renderDesign(design) {
  background(225);
  noStroke();
  drawLimit = Math.min(maxTotalCircles, design.length);

  for (let i = 0; i < drawLimit; i++) {
    const circle = design[i];
    fill(circle.color[0], circle.color[1], circle.color[2], circle.color[3]);
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
    circle.r = mut(circle.r, minCircleSize, maxCircleSize, rate);

    let ix = Math.floor(circle.x * 4);
    let iy = Math.floor(circle.y * 4);
    ix = constrain(ix, 0, inspiration.image.width - 1);
    iy = constrain(iy, 0, inspiration.image.height - 1);
    let idx = 4 * (iy * inspiration.image.width + ix);
    let imgPixels = inspiration.image.pixels;
    
    if (idx + 2 < inspiration.image.pixels.length) {
      circle.color[0] = mut(inspiration.image.pixels[idx], 0, 255, rate);
      circle.color[1] = mut(inspiration.image.pixels[idx + 1], 0, 255, rate);
      circle.color[2] = mut(inspiration.image.pixels[idx + 2], 0, 255, rate);
    }
   
    circle.color[3] = Math.floor(mut(circle.color[3], minAlphaTransparency, maxAlphaTransparency, rate));
  }

  generationCounter++;
  if (generationCounter % mutationThreshold === 0) {
    for (let i = 0; i < newCirclesPerMutation; i++) {
      design.push(randomCircle(inspiration, minCircleSize, maxCircleSize));
    }
  }
}