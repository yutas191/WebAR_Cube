var camera, renderer;
var source, context;

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var app = new App(scene,context);
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
		app.touch(obj[0].object.name);                       // タッチされた対象に応じた処理を実行
		}
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
	resize();
	camera.updateProjectionMatrix();
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
