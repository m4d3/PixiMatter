/*jshint esversion: 6 */

;(function() {
  "use strict";
  let stage, renderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite;

  let animals;

  function preload() {
    PIXI.loader
    .add("img/animalSheet.json")
    .load(setup);

    function setup() {
      initRenderer();
      setupObjects();
      loop();
    }
  }

  function initRenderer() {
    renderer = PIXI.autoDetectRenderer(500, 300);

    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();
    animals = [];

    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    renderer.render(stage);
  }

  function setupObjects() {
    const atlas = PIXI.loader.resources["img/animalSheet.json"].textures;
    const spriteNames = ["elephant.png", "hippo.png", "giraffe.png"];

    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
      let newAnimal = new PIXI.Sprite(atlas[spriteNames[getRandomInt(0, 2)]]);
      newAnimal.vx = i;
      newAnimal.scale.x = newAnimal.scale.y = 0.25;
      newAnimal.x = 100 * i;
      newAnimal.y = 100* j;
      stage.addChild(newAnimal);
      animals.push(newAnimal);
    }
    }

  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function loop() {
    requestAnimationFrame(loop);

    /* elephant.y += elephant.vx;

    if(elephant.y > window.innerHeight || elephant.y < 0) {
      elephant.vx *= -1;
      elephant.acc = 0;
    } */

    /* for(let i=0; i< animals.length; i++) {
      let animal = animals [i];
      animal.y += animal.vx;
      if(animal.y  + animal.height > window.innerHeight || animal.y < 0) {
        animal.vx *= -1;
        animal.acc = 0;
      }
    } */

    renderer.render(stage);
  }

  preload();

}());
