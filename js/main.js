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
  let tnk, pointer;
  let chm;
  let currentDragged = null;

  let rows = 6, columns = 6;

  function preload() {
    PIXI.loader
    .add("img/animalSheet.json")
    .load(setup);

    function setup() {
      initRenderer();
      setupObjects();
      findClusters();
      loop();
    }
  }

  function initRenderer() {
    renderer = PIXI.autoDetectRenderer(500, 300);

    document.body.appendChild(renderer.view);
    stage = new PIXI.Container();

    renderer.view.style.position = "absolute";
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);
    renderer.render(stage);

    chm = new Charm(PIXI);
  }

  function setupObjects() {
    const atlas = PIXI.loader.resources["img/animalSheet.json"].textures;
    const spriteNames = ["elephant.png", "hippo.png", "giraffe.png", "parrot.png", "monkey.png", "panda.png", "penguin.png", "pig.png", "rabbit.png", "snake.png"];

    animals = new Array(columns);
    for (let i = 0; i < rows; i++) {
      animals[i] = new Array(rows);
      for (let j = 0; j < columns; j++) {
        //let newAnimal = new PIXI.Sprite(atlas[spriteNames[getRandomInt(0, 3)]]);
        let type = getRandomInt(0, 3);
        let newAnimal = new animal(atlas[spriteNames[type]]);

        newAnimal.type = type;
        newAnimal.coords.x = i;
        newAnimal.coords.y = j;
        newAnimal.x = 100 * i;
        newAnimal.y = 100 * j;

        animals[i][j] = newAnimal;
        stage.addChild(newAnimal);
        //animals.push(newAnimal);
      }
    }

  }

  class animal extends PIXI.Sprite {
    constructor(spriteName) {
      super(spriteName);
      this.scale.x = this.scale.y = 0.25;

      this.coords = {
        x : 0,
        y : 0
      };
      this.type = -1;

      this.interactive = true;

      this.mouseover = function() {
        document.body.style.cursor = "pointer";
      }
      this.mouseout = function() {
        document.body.style.cursor = "auto";
      }
    }
  }

  // Array of clusters
  let clusters = [];  // { column, row, length, horizontal }

  // Find clusters in the level

  function findClusters() {
    for (let j=0; j<rows; j++) {

      let matchlength = 1;

      for (let i=0; i<columns; i++) {

        let checkcluster = false;

        if (i == columns-1) {
          // Last tile
          checkcluster = true;
        } else {
          if (animals[i][j].type == animals[i+1][j].type &&
            animals[i][j].type != -1) {
              // Same type as the previous tile, increase matchlength
              matchlength += 1;
            } else {
              // Different type
              checkcluster = true;
            }
          }
          if (checkcluster) {
            if (matchlength >= 3) {
              console.log("horizontal cluster found at: "+i+" , "+j);
              clusters.push({ column: i+1-matchlength, row:j,
                length: matchlength, horizontal: true });
              }
              matchlength = 1;
            }

          }
        }

        for (let i=0; i<columns; i++) {
          // Start with a single tile, cluster of 1
          let matchlength = 1;
          for (let j=0; j<rows; j++) {
            let checkcluster = false;

            if (j == rows-1) {
              // Last tile
              checkcluster = true;
            } else {
              // Check the type of the next tile
              if (animals[i][j].type == animals[i][j+1].type &&
                animals[i][j].type != -1) {
                  // Same type as the previous tile, increase matchlength
                  matchlength += 1;
                } else {
                  // Different type
                  checkcluster = true;
                }
              }

              // Check if there was a cluster
              if (checkcluster) {
                if (matchlength >= 3) {
                  // Found a vertical cluster
                  console.log("vertical cluster found at: "+i+" , "+j);
                  clusters.push({ column: i, row:j+1-matchlength,
                    length: matchlength, horizontal: false });
                  }

                  matchlength = 1;
                }
              }
            }

            removeClusters();
          }

          function removeClusters() {
            clusters.forEach(function(cluster, index) {
              for(let i = 0; i < cluster.length; i++) {
                console.log("horizontal: "+cluster.horizontal+" count: "+i);
                if(cluster.horizontal) {
                  removeAnimal(animals[cluster.column + i][cluster.row]);
                  //animals[cluster.column + i][cluster.row].alpha = 0.2;
                  if(cluster.row !== 0) {
                    for(let j = cluster.row; j > -1; j--) {
                      chm.slide(animals[cluster.column + i][j],(cluster.column+i)* 100, (j + 1) * 100, 60, "decelerationCubed");
                    }
                  }
                } else {
                  removeAnimal(animals[cluster.column][cluster.row + i]);
                  //animals[cluster.column][cluster.row + i].alpha = 0.2;
                  if(cluster.row !== 0) {
                    for(let j = cluster.row; j > -1; j--) {
                      chm.slide(animals[cluster.column][j],cluster.column* 100, (cluster.row + j) * 100, 60, "decelerationCubed");
                    }
                  }
                }
              }
            });
          }

          function removeAnimal(animal) {
            chm.fadeOut(animal, 40, "accelerationCubed");
            chm.scale(animal, 0.4, 0.4, 60, "inverseSineCubed");
          }

          function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }

          function loop() {
            requestAnimationFrame(loop);

            chm.update();

            renderer.render(stage);
          }

          preload();

        }());
