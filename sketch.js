var PLAY = 1;
var END = 0;
var WON=2;
var gameState = PLAY;

var harry, harry_img;
var ground, invisibleGround, groundImage, groundImage1, groundImage2, groundImage3, groundImage4, groundImage5;

var enemiesGroup, enemyImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var level=1;


function preload(){

  harry_img =   loadImage("harry.png");
  
  groundImage = loadAnimation("hill background.png");

 groundImage1 = loadAnimation("background.jpg");
  groundImage2 = loadAnimation("candy background.png");
  groundImage3 = loadAnimation("clouds.png");
  groundImage4 = loadAnimation("mountains.jpg");
  groundImage5 = loadAnimation("trees.png");
  enemyImage = loadImage("dementor.png");
  
  obstacle1 = loadImage("blue potion.png");
  obstacle2 = loadImage("gold potion.png");
  obstacle3 = loadImage("green potion.png");
  obstacle4 = loadImage("purple potion.png");
  obstacle5 = loadImage("red potion.png");
  obstacle6 = loadImage("golden snitch.png");
  
  gameOverImg = loadImage("game over.png");
  restartImg = loadImage("restart button.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  ground = createSprite(width/2,height/2,width,10);
  ground.addAnimation("ground",groundImage);
  ground.velocityX=-10

  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  

  
  harry = createSprite(350,390,20,50);
  harry.addImage(harry_img);

  harry.scale = 0.4;

 
  harry.debug=false
  harry.setCollider('circle',-50,0,150)
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2+100);
  restart.addImage(restartImg);
  
  gameOver.scale = 1.3;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,560,width,10);
  invisibleGround.visible = false;
  
  enemiesGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {

  //Add velocity to the ground

  //harry.debug = true;
  //background(0);

  if (gameState===PLAY){
    ground.velocityX = -(6 + 3*score/100);
    score = score + Math.round(getFrameRate()/60);
    if(score>=500 && score<1000){
     // ground = createSprite(width/2,height/2,width,height);
      ground.addAnimation("ground",groundImage1);
      level=2;
    }else if(score>=1000 && score<1500){
      ground.addAnimation("ground",groundImage2);
      level=3;
    }else if(score>=1500 && score<2000){
      ground.addAnimation("ground",groundImage3);
      level=4;
    }else if(score>=2000 && score<2500){
      ground.addAnimation("ground",groundImage4);
      ground.scale=1.5
      level=5;
    }else if(score>=2500 && score<3000){
      ground.addAnimation("ground",groundImage5);
      ground.scale=0.8;
      level=6;
    }else if(score>=700){
      gameState=WON;
    }
   
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && harry.y >= 159) {
      harry.velocityY = -12;
    }
  
    harry.velocityY = harry.velocityY + 0.8
  
    if (ground.x < 200){
      ground.x = ground.width/2;
    }
  
    harry.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(enemiesGroup.isTouching(harry)){
        gameState = END;
    }
    if(obstaclesGroup.isTouching(harry)){
      for(var i=0;i<obstaclesGroup.length;i++){
        obstaclesGroup.get(i).destroy();

        switch(i) {
          case 1: ground.velocityX-=2;
                  break;
          case 2: ground.velocityX+=2;
                  break;
          case 3: if(harry.scale>0){
                  harry.scale -=0.2;
                  } else {
                    score -=5;
                  }
                  break;
          case 4: if(harry.scale<1){
                  harry.scale +=0.2;
                  }
                  else{
                    score +=5;
                  }
                  break;
          case 5: //obstaclesGroup[i].velocityX+=2
                  break;
          case 6: //obstaclesGroup[i].velocityX-=2;
                  break;
          default: break;
        }
        
      }
  }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    harry.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    enemiesGroup.setVelocityXEach(0);
    
    //change the harry animation
   
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    enemiesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
  textSize(32);
  fill("purple");
  stroke("yellow");
  strokeWeight(3);
  text("Score: "+ score, width-200,100);
  text("Level: "+ level, width-200,200);

  if(gameState===WON){
    textSize(52);
    text("Congratulations! You Won with a score of "+score, width/2-500,height/2-100);
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    harry.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the harry animation
   
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 250 === 0) {
    var enemy = createSprite(width,120,40,10);
    enemy.y = Math.round(random(200,height-200));
    enemy.addImage(enemyImage);
    enemy.scale = 0.4;
    enemy.velocityX = -6;
    
     //assign lifetime to the variable
     enemy.lifetime = 400;
     enemy.debug=false;
     enemy.setCollider("circle",-110,-60,120);
    //adjust the depth
    enemy.depth = harry.depth;
    enemy.depth = harry.depth + 1;
    
    //add each cloud to the group
    enemiesGroup.add(enemy);
  }
  
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(width,height/2-200,height/2+200,30,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.setCollider("rectangle",0,0,100,200);
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.setCollider("rectangle",0,0,300,400)
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              obstacle.setCollider("rectangle",0,0,300,400)
              break;
      case 5: obstacle.addImage(obstacle5);
              obstacle.velocityX+=2;
              obstacle.setCollider("rectangle",0,0,100,200)
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.setCollider("rectangle",0,0,400,200)
              obstacle.velocityX-=2;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 600;
   
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  enemiesGroup.destroyEach(); 
  score = 0;
  level = 1;
  ground.addAnimation("ground",groundImage);
}