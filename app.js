const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/NotesDB')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log(err));

// ✅ Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Users = mongoose.model('Users', userSchema);

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
});
const Note = mongoose.model('Note', noteSchema);

// ✅ Session setup
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/NotesDB' }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// ✅ Middleware
function isAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// ✅ Routes
app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await Users.create({ username, email, password: hashed });
    res.redirect('/login');
  } catch (err) {
    console.log(err);
    res.send('Registration failed. Email may already exist.');
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send('❌ Please enter both email and password');
  }

  const user = await Users.findOne({ email: email.toLowerCase() });
  if (!user) return res.send('❌ No user found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send('❌ Invalid password');

  req.session.userId = user._id;
  res.redirect('/dashboard');
});


// DASHBOARD
app.get('/dashboard', isAuth, async (req, res) => {
  const user = await Users.findById(req.session.userId);
  const notes = await Note.find({ userId: req.session.userId });
  res.render('dashboard', { username: user.username, email: user.email, notes });
});

// ADD NOTE
app.get('/add-note', isAuth, (req, res) => res.render('add-note'));

app.post('/add-note', isAuth, async (req, res) => {
  const { title, content } = req.body;
  await Note.create({ title, content, userId: req.session.userId });
  res.redirect('/dashboard');
});

// UPDATE NOTE
app.get('/update/:id', isAuth, async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.render('update', { note });
});

app.post('/update/:id', isAuth, async (req, res) => {
  const { title, content } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect('/dashboard');
});

// DELETE NOTE
app.post('/delete/:id', isAuth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

// LOGOUT
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ✅ Server start
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
