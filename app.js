const express = require('express')
const exphbs = require('express-handlebars');
const URL = require('./models/URL')
const bodyParser = require('body-parser')
const generateURL = require('./lib/generateURL')
const isValidURL = require('./lib/isValidURL')
require('./config/mongoose')

const app = express()
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

//首頁路由
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