function generateURL(){
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shorterURL = '';

  // 隨機選取一個英文字母
  const randomLetterIndex = Math.floor(Math.random() * 52);
  shorterURL += characters[randomLetterIndex];

  // 隨機選取一個數字
  const randomNumberIndex = Math.floor(Math.random() * 10) + 52;
  shorterURL += characters[randomNumberIndex];

  // 隨機選取個英文字母
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * 62);
    shorterURL += characters[randomIndex];
  }

  // 隨機打亂生成的亂碼順序
  shorterURL = shorterURL.split('').sort(() => 0.5 - Math.random()).join('');

  return shorterURL;
}


module.exports=generateURL