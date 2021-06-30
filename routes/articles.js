const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

// 저장 및 홈페이지로 나가기를 원하는데 저장이 안된다.
router.put('/test', async (req, res) => {
  let article = new Article({
    title : req.body.title,
    description : req.body.description,
    writer: req.body.writer,
    password: req.body.password
  })
  try {
    console.log('?')
    article = await article.save()
    console.log('>?')
    res.redirect(`/articles/${article.id}`)
  }catch (e) {
    console.log(e)
    console.log('f')
    res.render('articles/new', { article: article })
  }
})


router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})

// router.post('/', async (req, res, next) => {
//   req.article = new Article()
//   next()
// }, saveArticleAndRedirect('new'))



router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    // article.markdown = req.body.markdown
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