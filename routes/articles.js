const express = require('express')
const Article = require('./../models/article')
const router = express.Router()


router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})


router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})


router.put('/edit/', async (req, res) => {
  password = req.body[`password`]
  _id = req.body[`_id`]
  title = req.body[`title`]
  description = req.body[`description`]
  writer = req.body[`writer`]
  find = await Article.findOne({ _id: _id, password: password })
  if (find != null) {
    await Article.updateOne( { _id }, { $set: {title, description, writer} } )
    res.send('correct')
  } else {
    res.send('false')
  }
})


router.delete('/edit', async (req, res) => {
  password = req.body.password
  _id = req.body._id
  find = await Article.findOne({ _id: _id, password: password })
  console.log(find)
  if (find != null) {
    await Article.findByIdAndDelete(_id)
    res.send('correct')
  } else {
    res.send('wrong')
  }
})


router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})


router.post('/', function (req, res) {
  let article = new Article();
  article.title = req.body.title
  article.description = req.body.description
  article.writer = req.body.writer
  article.password = req.body.password
  article.save(function (err) {
    if (err) {
      console.error(err);
      res.json({ result: '이미 존재하는 제목이다! 뒤로가서 수정하자!' });
      return;
    }
    res.redirect('/')
  });
});


router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))


function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.writer = req.body.writer
    article.password = req.body.password
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router