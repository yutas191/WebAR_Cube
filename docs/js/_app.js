//===================================================================
// three.js �̊e��ݒ�
//===================================================================
var scene = new THREE.Scene();                        // �V�[���̍쐬
var renderer = new THREE.WebGLRenderer({              // �����_���̍쐬
  antialias: true,                                    // �A���`�G�C���A�X�L��
  alpha: true,                                        // canvas�ɓ����x�o�b�t�@����������
});
renderer.setClearColor(new THREE.Color("black"), 0);  // �����_���̔w�i�F
renderer.setSize(640, 480);                           // �����_���̃T�C�Y
renderer.domElement.style.position = "absolute";      // �����_���̈ʒu�͐�Βl
renderer.domElement.style.top = "0px";                // �����_���̏�[
renderer.domElement.style.left = "0px";               // �����_���̍��[
document.body.appendChild(renderer.domElement);       // �����_���� DOM �� body �ɓ����
var camera = new THREE.Camera();                      // �J�����̍쐬
scene.add(camera);                                    // �J�������V�[���ɒǉ�
var light = new THREE.DirectionalLight(0xffffff);     // ���s�����i���j���쐬
light.position.set(0, 0, 2);                          // �J������������Ƃ炷
scene.add(light);                                     // �V�[���Ɍ�����ǉ�
var ambientlight = new THREE.AmbientLight(0x888888);
scene.add(ambientlight);

//===================================================================
// arToolkitSource�i�}�[�J�g���b�L���O���郁�f�B�A�\�[�X�j
//===================================================================
var source = new THREEx.ArToolkitSource({             // arToolkitSource�̍쐬
  sourceType: "webcam",                               // Web�J�����ݒ�
});
source.init(function onReady() {                      // �\�[�X�����������A�������ł�����
  onResize();                                         // ���T�C�Y����
});

//===================================================================
// arToolkitContext�i�J�����p�����[�^�A�}�[�J���o�ݒ�j
//===================================================================
var context = new THREEx.ArToolkitContext({           // arToolkitContext�̍쐬
  debug: false,                                       // �f�o�b�O�p�L�����o�X�\���i�f�t�H���gfalse�j
  cameraParametersUrl: "./data/camera_para.dat",             // �J�����p�����[�^�t�@�C��
  detectionMode: "mono",                              // ���o���[�h�icolor/color_and_matrix/mono/mono_and_matrix�j
  imageSmoothingEnabled: true,                        // �摜���X���[�W���O���邩�i�f�t�H���gfalse�j
  maxDetectionRate: 60,                               // �}�[�J�̌��o���[�g�i�f�t�H���g60�j
  canvasWidth: source.parameters.sourceWidth,         // �}�[�J���o�p�摜�̕��i�f�t�H���g640�j
  canvasHeight: source.parameters.sourceHeight,       // �}�[�J���o�p�摜�̍����i�f�t�H���g480�j
});
context.init(function onCompleted(){                  // �R���e�N�X�g������������������
  camera.projectionMatrix.copy(context.getProjectionMatrix());   // �ˉe�s����R�s�[
});

//===================================================================
// ���T�C�Y����
//===================================================================
window.addEventListener("resize", function() {        // �E�B���h�E�����T�C�Y���ꂽ��
  onResize();                                         // ���T�C�Y����
});
// ���T�C�Y�֐�
function onResize(){
  source.onResizeElement();                           // �g���b�L���O�\�[�X�����T�C�Y
  source.copyElementSizeTo(renderer.domElement);      // �����_���������T�C�Y��
  if(context.arController !== null){                  // arController��null�łȂ����
    source.copyElementSizeTo(context.arController.canvas);  // ����������T�C�Y��
  } 
}

//===================================================================
// ArMarkerControls�i�}�[�J�ƁA�}�[�J���o���̕\���I�u�W�F�N�g�j
//===================================================================
//-------------------------------
// ���̂P�ikanji�}�[�J�{�����́j
//-------------------------------
// �}�[�J
var marker1 = new THREE.Group();                      // �}�[�J���O���[�v�Ƃ��č쐬
var controls = new THREEx.ArMarkerControls(context, marker1, {    // �}�[�J��o�^
  type: "pattern",                                    // �}�[�J�̃^�C�v
  patternUrl: "./data/kanji.patt",                            // �}�[�J�t�@�C��
});
scene.add(marker1);                                   // �}�[�J���V�[���ɒǉ�
// ���f���i���b�V���j
var geo = new THREE.CubeGeometry(1, 1, 1);            // cube �W�I���g���i�T�C�Y�� 1x1x1�j
var mat = new THREE.MeshNormalMaterial({              // �}�e���A���̍쐬
  transparent: true,                                  // ����
  opacity: 0.8,                                       // �s�����x
  side: THREE.DoubleSide,                             // �������`��
});
var mesh1 = new THREE.Mesh(geo, mat);                 // ���b�V���𐶐�
mesh1.name = "cube";                                  // ���b�V���̖��O�i��Ńs�b�L���O�Ŏg���j
mesh1.position.set(0, 0.5, 0);                        // �����ʒu
marker1.add(mesh1);                                   // ���b�V�����}�[�J�ɒǉ�

//-------------------------------
// ���̂Q�ihiro�}�[�J�{.json�j
//-------------------------------
// �}�[�J
var marker2 = new THREE.Group();                      // �}�[�J���O���[�v�Ƃ��č쐬
var controls = new THREEx.ArMarkerControls(context, marker2, {    // �}�[�J��o�^
  type: "pattern",                                    // �}�[�J�̃^�C�v
  patternUrl: "./data/hiro.patt",                           // �}�[�J�t�@�C��
});
scene.add(marker2);                                   // �}�[�J���V�[���ɒǉ�
// ���f���i���b�V���j
var mesh2;                                            // ���f�������锠
var loader = new THREE.JSONLoader();                  // json�`���̃��f����ǂݍ��ރ��[�_
loader.load("./model/rocketX.json", function(geo, mat) {       // ���f����ǂݍ���
  mat = new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture("./model/rocketX.png")});
  mesh2 = new THREE.Mesh(geo, mat);                   // ���b�V����
  mesh2.name = "rocket";                              // ���b�V���̖��O�i��Ńs�b�L���O�Ŏg���j
  mesh2.scale.set(0.3, 0.3, 0.3);                     // �����T�C�Y�i�������킹�j
  mesh2.position.set(0, 0.5, 0);                      // �����ʒu�i�������킹�j
  marker2.add(mesh2);                                 // ���b�V�����}�[�J�ɒǉ�
});

//===================================================================
// Tween �A�j���[�V����
//===================================================================
//-------------------------------
// mesh1 �ɂ��āicube���]����j
//-------------------------------
var twIni1 = {posZ: 0, rotX: 0};                      // �����p�����[�^
var twVal1 = {posZ: 0, rotX: 0};                      // tween�ɂ���čX�V�����p�����[�^
var twFor1 = {posZ: -2, rotX: -Math.PI};              // �^�[�Q�b�g�p�����[�^
function tween1() {                                   // �u�s���v�̃A�j���[�V����
  var tween = new TWEEN.Tween(twVal1)                 // tween�I�u�W�F�N�g���쐬
  .to(twFor1, 2000)                                   // �^�[�Q�b�g�Ɠ��B����
  .easing(TWEEN.Easing.Back.Out)                      // �C�[�W���O
  .onUpdate(function() {                              // �t���[���X�V���̏���
    mesh1.position.z = twVal1.posZ;                   // �ʒu��ύX
    mesh1.rotation.x = twVal1.rotX;                   // ��]��ύX
  })
  .onComplete(function() {                            // �A�j���[�V�����������̏���
    tween1_back();                                    // �u�A��v�̃A�j���[�V���������s
  })
  .delay(0)                                           // �J�n�܂ł̒x������
  .start();                                           // tween�A�j���[�V�����J�n
}
function tween1_back() {                              // �u�A��v�̃A�j���[�V����
  var tween = new TWEEN.Tween(twVal1)
  .to(twIni1, 2000)                                   // �^�[�Q�b�g�������p�����[�^�ɐݒ�
  .easing(TWEEN.Easing.Back.InOut)
  .onUpdate(function() {
    mesh1.position.z = twVal1.posZ;
    mesh1.rotation.x = twVal1.rotX;
  })
  .onComplete(function() {
    // �Ȃɂ����Ȃ�
  })
  .delay(100)
  .start();
}
//-------------------------------
// mesh2 �ɂ��āirocket����ԁj
//-------------------------------
var twIni2 = {posY: 0, rotY: 0};                      // �����p�����[�^
var twVal2 = {posY: 0, rotY: 0};                      // tween�ɂ���čX�V�����p�����[�^
var twFor2 = {posY: 2, rotY: 2*Math.PI};              // �^�[�Q�b�g�p�����[�^
function tween2() {                                   // �u�s���v�̃A�j���[�V����
  var tween = new TWEEN.Tween(twVal2)                 // tween�I�u�W�F�N�g���쐬
  .to(twFor2, 2000)                                   // �^�[�Q�b�g�Ɠ��B����
  .easing(TWEEN.Easing.Quadratic.InOut)               // �C�[�W���O
  .onUpdate(function() {                              // �t���[���X�V���̏���
    mesh2.position.y = twVal2.posY;                   // �ʒu��ύX
    mesh2.rotation.y = twVal2.rotY;                   // ��]��ύX
  })
  .onComplete(function() {                            // �A�j���[�V�����������̏���
    tween2_back();                                    // �u�A��v�̃A�j���[�V���������s
  })
  .delay(0)                                           // �J�n�܂ł̒x������
  .start();                                           // tween�A�j���[�V�����J�n
}
function tween2_back() {                              // �u�A��v�̃A�j���[�V����
  var tween = new TWEEN.Tween(twVal2)
  .to(twIni2, 3000)                                   // �^�[�Q�b�g�������p�����[�^�ɐݒ�
  .easing(TWEEN.Easing.Quintic.InOut)
  .onUpdate(function() {
    mesh2.position.y = twVal2.posY;
    mesh2.rotation.y = twVal2.rotY;
  })
  .onComplete(function() {
    // �Ȃɂ����Ȃ�
  })
  .delay(5000)
  .start();
}

//===================================================================
// �}�E�X�_�E������
//===================================================================
window.addEventListener("mousedown", function(ret) {
  var mouseX = ret.clientX;                           // �}�E�X��x���W
  var mouseY = ret.clientY;                           // �}�E�X��y���W
  mouseX =  (mouseX / window.innerWidth)  * 2 - 1;    // -1 �` +1 �ɐ��K�����ꂽx���W
  mouseY = -(mouseY / window.innerHeight) * 2 + 1;    // -1 �` +1 �ɐ��K�����ꂽy���W
  var pos = new THREE.Vector3(mouseX, mouseY, 1);     // �}�E�X�x�N�g��
  pos.unproject(camera);                              // �X�N���[�����W�n���J�������W�n�ɕϊ�
  // ���C�L���X�^���쐬�i�n�_, �����̃x�N�g���j
  var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
  var obj = ray.intersectObjects(scene.children, true);   // ���C�ƌ��������I�u�W�F�N�g�̎擾
  if(obj.length > 0) {                                // ���������I�u�W�F�N�g�������
    touch(obj[0].object.name);                       // �^�b�`���ꂽ�Ώۂɉ��������������s
  }
});
// �^�b�`���ꂽ�Ώۂɉ���������
function touch(objName) {
  switch(objName) {
    case "cube":                                      // cube�Ȃ�
      tween1();                                       // cube�̃A�j���[�V���������s
      break;
    case "rocket":                                    // rocket�Ȃ�
      tween2();                                       // rocket�̃A�j���[�V���������s
      break;
    default:
      break;
  }
}

//===================================================================
// �����_�����O�E���[�v
//===================================================================
function renderScene() {                              // �����_�����O�֐�
  requestAnimationFrame(renderScene);                 // ���[�v��v��
  if(source.ready === false)    { return; }             // ���f�B�A�\�[�X�̏������ł��Ă��Ȃ���Δ�����
  context.update(source.domElement);                  // ARToolkit�̃R���e�L�X�g���X�V
  TWEEN.update();                                     // Tween�A�j���[�V�������X�V
  renderer.render(scene, camera);                     // �����_�����O���{
}
renderScene();                                        // �ŏ���1�񂾂������_�����O���g���K
