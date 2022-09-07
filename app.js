const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars').engine //had to add the property of engine to allow it to be used as a function
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo') //no longer requires (session)
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
const connectDB = require('./config/db')
const { findById } = require('./models/User')



// Load Config
dotenv.config({ path: './config/config.env' })

// Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

// Logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
}

// Handlebars helpers
const { formatDate, postedDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')


// Handlebars
app.engine('.hbs', exphbs({ 
    helpers: { 
        formatDate,
        postedDate,
        stripTags,
        truncate,
        editIcon,
        select, 
    }, 
    defaultLayout: 'main', 
    extname: '.hbs' 
    })
)
app.set('view engine', '.hbs')
app.set('views', './views')

// Sessions
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
    })
)



// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global variable
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})


// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3005

app.listen(PORT, () => { 
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})