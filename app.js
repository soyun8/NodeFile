const fs = require("fs");
const path = require("path");

// 풀더 생성
// 폴더 3개를 만들어야 하는데 이걸 배열로 만드는 법
// test 중복 .. 어떻게 해결하지?

const folderName = ["test/video", "test/captured", "test/duplicated"];

for (let i = 0; i < folderName.length; i++) {
  try {
    //만약에 이 폴더가 없으면 만들어줘
    if (!fs.existsSync(folderName[i])) {
      fs.mkdirSync(folderName[i]);
    }
  } catch (err) {
    console.error(err);
  }
}


const dir = "./test"; // 파일 목록 읽어올 폴더

fs.readdir(dir, function (err, filelist) {
  // fs모듈의 readdir함수를 사용해
  // 첫번째 인자로 파일 목록을 읽을 폴더(dir)를 가져오고
  // 콜백함수의 두번째 인자로 폴더(dir)의 파일목록(filelist)을 가져옴

  console.log(filelist);
  //배열을 foreach로 흩뿌려주기 (list를 string 으로)
  filelist.forEach(function (element) {
    console.log(element);

    //이제 조건문!! 확장자 조건문
    // 왜 이모양이야 ㅜㅜ
    if (element.includes('.mp4')) {
      fs.promises
        .rename(path.join('./test',element),path.join('./test/video',element))
        .catch(console.error);
    }else if (element.includes('.mov')) {
      fs.promises
        .rename(path.join('./test',element),path.join('./test/video',element))
        .catch(console.error);
    } else if (element.includes('.jpg')) {
      if (element.includes('E')) {
        fs.promises
        .rename(path.join('./test',element),path.join('./test/duplicated',element))
        .catch(console.error);
      }else{
      fs.promises
        .rename(path.join('./test',element),path.join('./test/captured',element))
        .catch(console.error);
      }
    } else if (element.includes('.png')) {
      fs.promises
        .rename(path.join('./test',element),path.join('./test/captured',element))
        .catch(console.error);
    } else {
     
    }
  });

});
