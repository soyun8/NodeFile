/*
1. 사용자가 원하는 폴더 이름 생성 (video, captured, duplicated)
2. 폴더 안에 있는 파일들을 다 돌면서 해당하는 mp4|mov = video, png|aae = captured, 
   IMG_E로 시작하는 파일은 원본 파일과 E 붙인 파일 같이 duplicated에 넣기
*/ 

const path = require('path');
const os = require('os');
const fs = require('fs');

// 계획
// 1. 사용자가 원하는 폴더의 이름을 받아온다
const folder = process.argv[2]; // 인자 주기 (test)
const workingDir = path.join('C:/', folder); // 사용자가 원하는 폴더 경로 입력
if (!folder || !fs.existsSync(workingDir)) { // 사용자가 원하는 폴더의 이름을 전달하지 않았거나 폴더 경로가 존재하지 않는다면
  console.error('Please enter folder name in Pictures'); //폴더 안에 있는 경로를 입력해라
  return; // 처리해주지 않고 리턴
}

// 2. 그 폴더안에 video, captured, duplicated 폴더를 만든다
const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated');

// sync(동기)를 쓰는 이유는 폴더를 먼저 만들고 다음 일들을 처리해야하기 때문이다. 
!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

// 3. 폴더안에 있는 파일들을 다 돌면서 해당하는 mp4|mov, png|aae, IMG_1234 (IMG_E1234)
fs.promises
  .readdir(workingDir) // 모든 파일 이름 가져오기
  .then(processFiles)
  .catch(console.log);

function processFiles(files) {
  files.forEach((file) => {
    if (isVideoFile(file)) {
      move(file, videoDir);
    } else if (isCapturedFile(file)) {
      move(file, capturedDir);
    } else if (isDuplicatedFile(files, file)) {
      move(file, duplicatedDir);
    }
  });
}

function isVideoFile(file) {
    // 정규 표현식 https://github.com/dream-ellie/regex
  const regExp = /(mp4|mov)$/gm;
  const match = file.match(regExp);
  return !!match; // !! 이란 match에 결과값이 있다면 true 아니면 false 로 나옴
}

function isCapturedFile(file) {
  const regExp = /(png|aae)$/gm;
  const match = file.match(regExp);
  return !!match;
}

function isDuplicatedFile(files, file) {
  // IMG_XXXX  -> IMG_EXXX
  if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
    return false;
  }

  const edited = `IMG_E${file.split('_')[1]}`;
  const found = files.find((f) => f.includes(edited));
  return !!found;
}

function move(file, targetDir) {
  console.info(`move ${file} to ${path.basename(targetDir)}`);
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises
    .rename(oldPath, newPath) //
    .catch(console.error);
}
