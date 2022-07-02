import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 8000

app.set('view engine', 'ejs')

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`)
})

