var camera, renderer;
var source, context;

var marker1, controls1;
var marker2, controls2;

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var app = new App(scene);
var loader = new THREE.JSONLoader();

init();
animate();

function init() {
	// レンダラの作成
	renderer = new THREE.WebGLRenderer({
	  antialias: true,
	  alpha: true,
	});

	renderer.setClearColor(new THREE.Color("black"), 0);
	renderer.setSize(640, 480);
	renderer.domElement.style.position = "absolute";
	renderer.domElement.style.top = "0px";
	renderer.domElement.style.left = "0px";
	document.body.appendChild(renderer.domElement);

	camera = new THREE.Camera();
	scene.add(camera);
/*
	// リサイズ処理
	window.addEventListener("resize", function() {
		resize();
	});

	// マウスダウン処理
	window.addEventListener("mousedown", function(ret) {
		var mouseX = ret.clientX;                           // マウスのx座標
		var mouseY = ret.clientY;                           // マウスのy座標
		mouseX =  (mouseX / window.innerWidth)  * 2 - 1;    // -1 ～ +1 に正規化されたx座標
		mouseY = -(mouseY / window.innerHeight) * 2 + 1;    // -1 ～ +1 に正規化されたy座標
		var pos = new THREE.Vector3(mouseX, mouseY, 1);     // マウスベクトル
		pos.unproject(camera);                              // スクリーン座標系をカメラ座標系に変換
		// レイキャスタを作成（始点, 向きのベクトル）
		var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
		var obj = ray.intersectObjects(scene.children, true);   // レイと交差したオブジェクトの取得
		if(obj.length > 0) {                                // 交差したオブジェクトがあれば
		//app.touch(obj[0].object.name);                       // タッチされた対象に応じた処理を実行
		}
	});
*/
	// ArToolkitSourceの作成
	source = new THREEx.ArToolkitSource({sourceType: "webcam"});

	// ソースを初期化
	source.init(function onReady() {
		resize();
	});

	// ArToolkitContextの作成
	context = new THREEx.ArToolkitContext({
		debug: false,
		cameraParametersUrl: "./data/camera_para.dat",
		detectionMode: "mono",
		imageSmoothingEnabled: true,
		maxDetectionRate: 60,
		canvasWidth: source.parameters.sourceWidth,
		canvasHeight: source.parameters.sourceHeight,
	});

	// コンテクスト初期化
	context.init(function onCompleted(){
		camera.projectionMatrix.copy(context.getProjectionMatrix());
	});

	// マーカ1
	marker1 = new THREE.Group();
	controls1 = new THREEx.ArMarkerControls(context, marker1, {type: "pattern",patternUrl: "./data/kanji.patt"});
	scene.add(marker1);

	// マーカ2
	marker2 = new THREE.Group();
	controls2 = new THREEx.ArMarkerControls(context, marker2, {type: "pattern",patternUrl: "./data/hiro.patt"});
	scene.add(marker2);

	// Cube
	var geometryCube = new THREE.CubeGeometry(1, 1, 1);
	var materialCube = new THREE.MeshNormalMaterial({transparent: true,opacity: 0.8,side:THREE.DoubleSide});
	meshCube = new THREE.Mesh(geometryCube, materialCube);
	meshCube.name = "cube";
	meshCube.position.set(0, 0.5, 0);
	marker1.add(meshCube);

	// Rocket
	loader.load("./model/rocketX.json", function(geometryRocket, materialRocket){
		materialRocket = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture("./model/rocketX.png"),side:THREE.DoubleSide});
		meshRocket = new THREE.Mesh(geometryRocket, materialRocket);
		meshRocket.name = "rocket";
		meshRocket.scale.set(0.3, 0.3, 0.3);
		meshRocket.position.set(0, 0.5, 0);
		marker2.add(meshRocket);
	});

	app.init();
}

function resize() {
	source.onResizeElement();
	source.copyElementSizeTo(renderer.domElement);
	if(context.arController !== null){
		source.copyElementSizeTo(context.arController.canvas);
	}
}

function update(dt) {
	app.update(dt);
}

function render(dt) {
	app.render(dt);
	renderer.render(scene, camera);
}

function animate() {
	requestAnimationFrame(animate);
	if(source.ready === false)    { return; }
	context.update(source.domElement);
	TWEEN.update();
	update(clock.getDelta());
	render(clock.getDelta());
}
