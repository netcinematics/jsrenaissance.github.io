 /// <reference path="/scripts/babylon.js" />
// window.addEventListener('DOMContentLoaded', function(){
function initAnyscape(){
    var asc = {};
    asc.sceneFreeCamera; //handle freecamera 
    asc.sceneFollowCamera; 

    //Stats
    var fpsstats = new Stats();
    var fpsdiv = document.getElementById('fpsstats');
    fpsdiv.appendChild(fpsstats.domElement);


    //STANDARD-VARIABLES*******************************************************
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    
    var cameraSets = []; //Multiple Camera Capability
    //**************************************************************************
    var ground;
    //mobile options 
    // engine.isPointerLock = true;
    // engine.switchFullscreen(true);

    function updateMsgTxt(tl){ 
        document.getElementById('icotrophy').style.color = '#cece00';
    }
    function collapseTrophyBar(tl){ 
        starBarCollapse.start();
    }
    function expandTrophyBar(tl){ 
        starBarExpand.start();
    }

    //**************************************************************************
    /**********************CAMERA-CODE**************************************/
    asc.cameraFollowTarget = function(target){   //called by renderloop to follow target.    
        var verticalOffsetControl = 1.3; //change y position of camera.
        var rotationControl = -45.5  //-40.5 is leftfacing. +40 is front facing. -45.5 is backfacing, 0 is rightfacing.     
        target.rotation.y = rotationControl - sceneFollowCamera.alpha;       
        sceneFollowCamera.target.x = parseFloat(target.position.x);      
        sceneFollowCamera.target.z = parseFloat(target.position.z);      
        sceneFollowCamera.target.y = parseFloat(target.position.y+verticalOffsetControl);   
    }
        
    asc.createCameraSets = function (){
        //CreateFollowCamera
        //CameraParams: name, alpha, beta, radius, target, scene.
        ascsceneFollowCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera1", -Math.PI/2, (Math.PI/2.9), 10, new BABYLON.Vector3(0, 5, 0), scene); 
        ascsceneFollowCamera.wheelPrecision = 15;   
        ascsceneFollowCamera.lowerRadiusLimit = 2;      //zoominandout
        ascsceneFollowCamera.upperRadiusLimit = 300; 
        ascsceneFollowCamera.upperBetaLimit = 1.5;//lock camera in place vertically.
        ascsceneFollowCamera.lowerBetaLimit = 1;//lock camera in place vertically.
        ascsceneFollowCamera.beta = 1.5;
        ascsceneFollowCamera.radius = 5; //distance camera is from target.  

        //CreateFreeCamera
        asc.sceneFreeCamera= new BABYLON.FreeCamera("FreeCamera1", new BABYLON.Vector3(0, 10, 0), scene);

        //Multi-Camera-Capability
        cameraSets = [asc.sceneFreeCamera, asc.sceneFollowCamera]; 

        if(false){ //TODO you.
            scene.activeCamera = sceneFollowCamera;  
            sceneFollowCamera.attachControl(canvas);
        } else if (true){
            scene.activeCamera = cameraSets[0];  
            cameraSets[0].attachControl(canvas);            
        }
    }

    /**********************END-CAMERA-CODE**************************************/

    /*********************************CREATE-ASSETS******************************/
    asc.loadAssets = function() {

        var assetsManager = new BABYLON.AssetsManager(scene); 
        //----ASSETS-MANAGER--------------Loading Indicator
        engine.loadingUIText = "Welcome...";

        //V1
        var meshTask = assetsManager.addMeshTask("skull task", "", "../3d/", "skull.babylon");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(0,-30,0);
        }

        var anymPlaygroundTask = assetsManager.addMeshTask("anym task", "", "../3d/", "anymplayground1.babylon");
        anymPlaygroundTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(34,34,34);
        }

        var meshTask = assetsManager.addMeshTask("worldbox", "", "../3d/", "worldbox2.babylon");
        meshTask.onSuccess = function (task) {
            task.loadedMeshes[0].position = new BABYLON.Vector3(10,10,10);
        }

        assetsManager.onFinish = function(tasks) {

            engine.runRenderLoop(function(){
                scene.render();
                fpsstats.update(); //fps counter
                if(scene.isReady()){              
                }
            });
        };
        assetsManager.load();  // IMPORTANT.

        //----END- ASSETS-MANAGER--------------Loading Indicator
    }
    // /*********************************END-CREATE-ASSETS******************************/


    /********************************CREATE-LIGHTS***********************************************/
    var light1,light2,light3,lightSphere1,lightSphere2,lightSphere3;//composite-member-pattern.
    asc.createLights = function() {   
        var LightDirectional = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-2, -4, 2), scene);    
        LightDirectional.diffuse = new BABYLON.Color3(1, 1, 1); 
        LightDirectional.specular = new BABYLON.Color3(0, 0, 0);
        LightDirectional.position = new BABYLON.Vector3(250, 400, 0);
        LightDirectional.intensity = .8;
        

        //todo create lights
        light1 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 10, 0), scene);
        light2 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(0, -10, 0), scene);
        light3 = new BABYLON.PointLight("Omni2", new BABYLON.Vector3(10, 0, 0), scene);

        // Lights colors
        light1.diffuse = new BABYLON.Color3(1, 0, 0);
        light1.specular = new BABYLON.Color3(1, 0, 0);

        light2.diffuse = new BABYLON.Color3(0, 1, 0);
        light2.specular = new BABYLON.Color3(0, 1, 0);

        light3.diffuse = new BABYLON.Color3(0, 0, 1);
        light3.specular = new BABYLON.Color3(0, 0, 1);

        //centroid sphere
        // var material = new BABYLON.StandardMaterial("k", scene);
        // var sphere = BABYLON.Mesh.CreateSphere("Sphere", 16, 3, scene);
        // material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        // sphere.material = material;

        // Creating light sphere
        lightSphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 16, 6, scene);
        lightSphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 26, 0.5, scene);
        lightSphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 36, 2, scene);

        lightSphere1.material = new BABYLON.StandardMaterial("red", scene);
        lightSphere1.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        lightSphere1.material.specularColor = new BABYLON.Color3(0, 0, 0);
        lightSphere1.material.emissiveColor = new BABYLON.Color3(1, 0, 0);

        lightSphere2.material = new BABYLON.StandardMaterial("green", scene);
        lightSphere2.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        lightSphere2.material.specularColor = new BABYLON.Color3(0, 0, 0);
        lightSphere2.material.emissiveColor = new BABYLON.Color3(0, 1, 0);

        lightSphere3.material = new BABYLON.StandardMaterial("blue", scene);
        lightSphere3.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
        lightSphere3.material.specularColor = new BABYLON.Color3(0, 0, 0);
        lightSphere3.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
    }

    /********************************CREATE-SCENE********************************/
    asc.createScene = function() {        
        //Scene: Activate gravity and collision
        scene = new BABYLON.Scene(engine);  
        scene.gravity = new BABYLON.Vector3(0, -0.8, 0);    //down y --0.98 is earth.
        scene.collisionsEnabled = true; 

        asc.createCameraSets(); //create multiple cameras.

        asc.createLights(); //create multiple lights.

 
        //todo break out to create methods

        //starbox
        var starbox = BABYLON.Mesh.CreateBox("starbox", 1800.0, scene);
        var starboxMaterial = new BABYLON.StandardMaterial("starbox", scene);
        starboxMaterial.backFaceCulling = false;
        starboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../3d/starbox/starbox5", scene);
        starboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        starboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        starboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        starboxMaterial.disableLighting = true;
        starbox.material = starboxMaterial;

        //ground
        // ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "../3d/scapes/heightMap_marz5.png", 200, 200, 250, 0, 10, scene, true);   
        ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "../3d/scapes/heightMap1.jpg", 200, 200, 250, 0, 10, scene, true);   
        var groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("../3d/scapes/tileElectro5.jpg", scene); //exceptional in blue light pinktricity.
        groundMaterial.diffuseTexture.uScale = 15; //smaller number = larger tile.
        groundMaterial.diffuseTexture.vScale = 15;
        ground.material = groundMaterial;   
        ground.checkCollisions = true;


        //Wall
        var Wall = BABYLON.Mesh.CreateBox("Wall", 1, scene);  
        Wall.scaling = new BABYLON.Vector3(15, 8, 15);
        Wall.position.x = 4;
        Wall.position.y = 4;
        Wall.position.z = 4;
        Wall.checkCollisions = true; 

        //Water 
        var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
        waterMaterial.bumpTexture = new BABYLON.Texture("../3d/scapes/WaterMaterial/waterbump.png", scene);
        waterMaterial.windForce = -10;
        waterMaterial.waveHeight = 0.1;
        waterMaterial.bumpHeight = 0.1;
        waterMaterial.waveLength = 0.1;
        waterMaterial.waveSpeed = 1.0;
        waterMaterial.colorBlendFactor = 0;
        waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
        waterMaterial.colorBlendFactor = 0;
        //water mesh
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 200, 200, 32, scene, false);
        waterMesh.material = waterMaterial;
        waterMaterial.addToRenderList(starbox); //only reflect the stars.

        //Moon
        var moonMaterial = new BABYLON.StandardMaterial("moonMaterial", scene);
        moonMaterial.diffuseTexture = new BABYLON.Texture("../3d/scapes/moon1.jpg", scene);
        var moon = BABYLON.Mesh.CreateSphere("moon", 32, 14, scene);
        moon.position.y = 40;
        moon.material = moonMaterial;

        //--loadAssets----------------------------------------------------------------------------
        asc.loadAssets(); //load remote mesh

        //--beforeRender----Animations----------------------------------------------------------------
        var alpha = 0;
        scene.beforeRender = function () {

            //moon
            moon.position = new BABYLON.Vector3(30 * Math.sin(alpha), 30, 10 * Math.cos(alpha)- 180);

            light1.position = new BABYLON.Vector3(10 * Math.sin(alpha), 30, 10 * Math.cos(alpha)- 80);
            light2.position = new BABYLON.Vector3(10 * Math.sin(alpha) + 80, 10, 10 * Math.cos(alpha));
            light3.position = new BABYLON.Vector3(20 * Math.cos(alpha), 30, 20 * Math.sin(alpha) + 80);
            //orbiting lights
            lightSphere1.position = light1.position;
            lightSphere2.position = light2.position;
            lightSphere3.position = light3.position;
            alpha += 0.01;

            if(scene.isReady()) {
            } 
        }

        return scene;
    } 
    /***********************************END-CREATE-SCENE********************************/   

    /*******************************************HYPER-VECTOR-TELEPORTATION************************************/
    //HyperVectorTeleporation. Hyperlink to Position-Teleportation mechanism.
    var hyperVectors = [ 
        {pos:{x:15,y:325,z:35},tar:{x:15,y:0,z:0}},
        {pos:{x:-0.02,y:9.42,z:8.66},tar:{x:-0.06,y:9.32,z:7.67}},
        {pos:{x:15,y:15,z:15},tar:{x:10,y:13,z:10}},
        {pos:{x:-8.19,y:7.32,z:-6.28},tar:{x:-7.70,y:7.36,z:-5.41}},
        {pos:{x:-92,y:9,z:29},tar:{x:-91,y:9,z:28}},
        {pos:{x:-43.19,y:18.79,z:33.87},tar:{x:-43.11,y:18.38,z:32.96}},
        {pos:{x:15.00,y:6.25,z:1.39},tar:{x:15.99,y:6.24,z:1.26}},
        {pos:{x:-100,y:9,z:74},tar:{x:-78,y:6,z:69}},
        // {pos:{x:-29.19,y:66.51,z:-191.69},tar:{x:-28.99,y:66.17,z:-190.76}},
        {pos:{x:-26.32,y:9.19,z:-49.61},tar:{x:-25.33,y:9.20,z:-49.47}},
        {pos:{x:40.65,y:7.43,z:45.92},tar:{x:40.99,y:7.36,z:44.98}},
        {pos:{x:5.49,y:6.23,z:33.40},tar:{x:5.37,y:6.44,z:32.43}},
        {pos:{x:15.06,y:5.31,z:-4.89},tar:{x:15.08,y:5.39,z:-3.89}},
        {pos:{x:93.35,y:1.38,z:-23.64},tar:{x:92.72,y:1.49,z:-24.40}},
        {pos:{x:93.35,y:1.38,z:-23.64},tar:{x:92.80,y:1.38,z:-22.80}},
        {pos:{x:-11.47,y:4.94,z:43.91},tar:{x:-10.55,y:4.73,z:43.58}},
        {pos:{x:26.10,y:7.13,z:34.60},tar:{x:25.91,y:7.29,z:33.63}},
        {pos:{x:10.47,y:7.28,z:10.89},tar:{x:11.33,y:7.32,z:11.38}}
    ];
    var hyperVectorIndex = 0;


    asc.hyperVectorPrev = function(){
        hyperVectorIndex = (hyperVectorIndex-1<=0)?hyperVectors.length:hyperVectorIndex-1;
        var angle = hyperVectors[hyperVectorIndex];
        asc.sceneFreeCamera.position = new BABYLON.Vector3(angle.pos.x,angle.pos.y,angle.pos.z);
        asc.sceneFreeCamera.setTarget( new BABYLON.Vector3(angle.tar.x,angle.tar.y,angle.tar.z));
    }
    asc.hyperVectorNext = function(){
        hyperVectorIndex = (hyperVectorIndex+1>=hyperVectors.length)?0:hyperVectorIndex+1;
        var angle = hyperVectors[hyperVectorIndex];
        asc.sceneFreeCamera.position = new BABYLON.Vector3(angle.pos.x,angle.pos.y,angle.pos.z);
        asc.sceneFreeCamera.setTarget( new BABYLON.Vector3(angle.tar.x,angle.tar.y,angle.tar.z));
    }
    asc.hyperLocate = function(){
        var p = asc.sceneFreeCamera.position, t = asc.sceneFreeCamera.getTarget();
        var pose = {pos:{x:Math.round(p.x),y:Math.round(p.y),z:Math.round(p.z)},tar:{x:Math.round(t.x),y:Math.round(t.y),z:Math.round(t.z)}};
        return pose; 
    }

    /*******************************************EVENTS************************************/
    function onKeyDown(e){ 
        // console.log(e.keyCode); //Diagnostic: keep off for performance. 
        // console.log(String.fromCharCode(e.keyCode)); //Diagnostic: keepoff for performance. 
        switch (e) {
            case 87: //'w':
            case 69: //'e':
            case 81: //'q':
                exampleMesh.rotation.x = 0.2;
            break;
            // case 88: //'x'
            case 90: //'z'
                exampleMesh.rotation.x = -0.2;
            break;
            case 65: //'a'
            case 'fastLeft':
            case 'touchLeft':
                // movementkeys.left=1;
                movementkeys.left=(e==='fastLeft')?2:1;
                movementkeys.right=0;
            case 37: //'leftarrow':
                exampleMesh.rotation.z = -0.2;
            break;
            case 68: //'d'
            case 'fastRight':
            case 'touchRight':
                movementkeys.right=(e==='fastRight')?2:1;
                // movementkeys.right=1;
            // case 'fastRight':
                // movementkeys.right=2;
                movementkeys.left=0;
            case 39: //'rightarrow':
                exampleMesh.rotation.z = 0.2;
            break;
            case 40: //'downarrow':
            break;
            case 38: //'uparrow':
            break;
            case 83:   //s   
            case 32: // SPACE
            case 'touchFwd':
                if(e==='touchFwd') {fwdSpeedMultiple=(fwdSpeedMultiple<fwdSpeedMax)?++fwdSpeedMultiple:fwdSpeedMax; } //fwd speed governer
                movementkeys.fwd=1;
            break;
            case 88://x  
            case 40://numpad2s 
            case 'touchBwd':
                movementkeys.fwd=0;
            break;
        }    
    }

    function onKeyUp(e){ 
       // DIAGNOSTICS: keep but, keepout for performance. 
        // var char = String.fromCharCode(e.keyCode);
        // console.log(e.keyCode);
        switch (e) {
            case 87: //'w':
            case 81: //'q':
                exampleMesh.rotation.x = 0;
            break;
            case 88: //'x':
            case 90: //'z':
        // exampleMesh.applyImpulse(new BABYLON.Vector3(0, 0, 1), exampleMesh.getBoundingInfo().boundingBox.center);
                exampleMesh.rotation.x = 0;
            break;
            // case 37: //'leftarrow':
            // case 65: //'a':
            //     exampleMesh.rotation.z = 0;
            // break;
            case 65: //'a'
            case 'fastLeft':
            case 'touchLeft':
                movementkeys.left=0;
            case 37: //'leftarrow':
                exampleMesh.rotation.z = 0;
            break;
            case 68: //'d'
            case 'fastRight':
            case 'touchRight':
                movementkeys.right=0;
            case 39: //'rightarrow':
                exampleMesh.rotation.z = 0;
            break;
            case 40: //'downarrow':
            break;
            case 38: //'uparrow':
            break;
            // case 'touchBwd':
            case 83: //'S':
            case 32: // SPACE              
                meshMoving = false;
                movementkeys.fwd=0;        
            break;
            break;
        } 
        //NUMPAD-CHARACTER-CODES!
        //1:35,2:40,3:34,4:37,5:12,6:39,7:36,8:38,9:33,0:45,+:107,-:109.     
    }

    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);
    window.addEventListener('resize', function(){ 
        engine.resize();
    });

    /**************************END-EVENTS***************************/

    /********************MESH-ANIMATIONS*********************************/
    function animateMovement(){
        if(!meshMoving && movementkeys.fwd==1){meshMoving = true;}//todo remove meshMoving. for fwdSpeedMultiple 0.
        var turnSpeedControl = 0.14;
        if(movementkeys.left===1){
            sceneFollowCamera.alpha -= turnSpeedControl;  // 0.05 slow 0.10 fast
        } else if(movementkeys.left===2){
            sceneFollowCamera.alpha -= 0.12;
        } else if(movementkeys.right===1){
            sceneFollowCamera.alpha += turnSpeedControl;
        } else if(movementkeys.right===2){
            sceneFollowCamera.alpha += 0.12;
        }
        if (movementkeys.fwd == 1) { //move forward
            var moveY = -0.5;   // div +0.1 is a rocket, no resistance, -0.9 more gravity.e.
            var moveX = parseFloat(Math.sin(parseFloat(exampleMesh.rotation.y))) / 1; //divided sin cos speed reduction 0.5 fast /0.9 slow
            var moveZ = parseFloat(Math.cos(parseFloat(exampleMesh.rotation.y))) / 1;
            exampleMesh.moveWithCollisions(new BABYLON.Vector3( moveX, moveY, moveZ )); //todo reuse vector obj?
        }  
    }

    /********************END-ANIMATIONS*********************************/


    /*****************INITIALIZATION-LOGIC******************/ 
    //CreateScene()----------------------------------------
    var scene = asc.createScene();
    //Run Rendering Loop ----------------------------------     
    // engine.runRenderLoop(function(){
    //     scene.render();
    //     if(scene.isReady()){              
    //     }
    // });


    //**************************************************************************


    return asc;
}; //END initAnyscape