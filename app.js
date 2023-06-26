const express = require('express')
const exphbs = require('express-handlebars');
const mongoose=require('mongoose')
const app = express()
const URL = require('./models/URL') // 載入 Todo model
const bodyParser = require('body-parser')
const generateURL = require('./lib/generateURL')
const isValidURL = require('./lib/isValidURL')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
  res.render('index')
})

//接收原始網址
app.post('/url', (req, res) => {
  const originalURL = req.body.originalURL;
  if (isValidURL(originalURL)){
    URL.findOne({ originalURL })
      .then(existingURL => {
        if (existingURL) {
          return res.render('index', { originalURL, shortenedURL: existingURL.shortenedURL });
        } else {
          const shortenedURL = generateURL();
          URL.create({ originalURL: originalURL, shortenedURL: shortenedURL })
            .then(() => res.render('index', { originalURL, shortenedURL }))
        }
      })
      .catch(error => console.log(error));
  }else{
    res.render('error', { originalURL })
  }


})

//導回原始網站
app.get('/:shortenedURL',(req,res)=>{
  const shortenedURL=req.params.shortenedURL
  URL.findOne({ shortenedURL })
    .then(existingURL => {
      if (existingURL) {
        res.redirect(existingURL.originalURL);
      } else {
        res.redirect('/'); // 如果找不到對應的短網址，可以導向首頁或其他處理方式
      }
    })
    .catch(error => console.log(error));
})

app.listen(3000,()=>{
  console.log('App is running on http://localhost:3000')
})