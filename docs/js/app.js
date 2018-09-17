var meshCube;
var meshRocket;
var marker1, controls1;
var marker2, controls2;

class App {
	init(context) {
		// ���C�g
		var light = new THREE.DirectionalLight(0xFFFFFF);
		light.position.set(0,0,2);
		scene.add( light );
		var ambientLight = new THREE.AmbientLight(0x888888);
		scene.add( ambientLight );

		// �}�[�J1
		marker1 = new THREE.Group();
		controls1 = new THREEx.ArMarkerControls(context, marker1, {type: "pattern",patternUrl: "./data/kanji.patt"});
		scene.add(marker1);

		// �}�[�J2
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
	}

	// �^�b�`
	touch(objName) {
		console.log(objName);
		switch(objName) {
		case "cube":
			this.tweenCube();
			break;
		case "rocket":
			this.tweenRocket();
			break;
		default:
			break;
		}
	}

	// �A�j���[�V����
	tweenCube() {
		var twIni1 = {posZ: 0, rotX: 0};			// �����ʒu
		var twFor1 = {posZ: -2, rotX: -Math.PI};	// �I�[�ʒu
		var twVal1 = {posZ: 0, rotX: 0};			// �X�V�p�����[�^

		var tween = new TWEEN.Tween(twVal1)			// �u�s���v�̃A�j���[�V����
		.to(twFor1, 2000)
		.easing(TWEEN.Easing.Back.Out)
		.onUpdate(function() {
			meshCube.position.z = twVal1.posZ;
			meshCube.rotation.x = twVal1.rotX;
			meshText1.position.z = twVal1.posZ;
		})
		.onComplete(function() {
			var tween = new TWEEN.Tween(twVal1)		// �u�A��v�̃A�j���[�V���������s
			.to(twIni1, 2000)
			.easing(TWEEN.Easing.Back.InOut)
			.onUpdate(function() {
				meshCube.position.z = twVal1.posZ;
				meshCube.rotation.x = twVal1.rotX;
				meshText1.position.z = twVal1.posZ;
			})
			.onComplete(function() {
				// �Ȃɂ����Ȃ�
			})
			.delay(100)
			.start();
		})
		.delay(0)
		.start();
	}

	// �A�j���[�V����
	tweenRocket() {
		var twIni2 = {posY: 0, rotY: 0};			// �����ʒu
		var twFor2 = {posY: 2, rotY: 2*Math.PI};	// �I�[�ʒu
		var twVal2 = {posY: 0, rotY: 0};			// �X�V�p�����[�^

		var tween = new TWEEN.Tween(twVal2)			// �u�s���v�̃A�j���[�V����
		.to(twFor2, 2000)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			meshRocket.position.y = twVal2.posY;
			meshRocket.rotation.y = twVal2.rotY;
			meshText2.position.y = twVal2.posY;
		})
		.onComplete(function() {
			var tween = new TWEEN.Tween(twVal2)		// �u�A��v�̃A�j���[�V���������s
			.to(twIni2, 3000)
			.easing(TWEEN.Easing.Quintic.InOut)
			.onUpdate(function() {
				meshRocket.position.y = twVal2.posY;
				meshRocket.rotation.y = twVal2.rotY;
				meshText2.position.y = twVal2.posY;
			})
			.onComplete(function() {
				// �Ȃɂ����Ȃ�
			})
			.delay(2000)
			.start();
		})
		.delay(0)
		.start();
	}

	// �X�V
	update(dt) {

	}

	// �`��
	render(dt) {

	}

}

