const express = require('express');
const passport = require('passport');
const NetflixStrategy = require('passport-netflix').Strategy;
const session = require('express-session');

const app = express();

app.use(session({
  secret: '',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new NetflixStrategy({
    clientID: 'Ov23liHau8hvCLqjYjLa',
    clientSecret: 'd793cff81e6fafcfee251b9e70654e36a26339d0',
    callbackURL: 'http://localhost:3000/auth/netflix/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/', (req, res) => {
  res.send('<a href="/auth/netflix">Logar no Netflix</a>');
});

app.get('/auth/netflix',
  passport.authenticate('netflix', { scope: ['profile'] })
);

app.get('/auth/netflix/callback',
  passport.authenticate('netflix', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/perfil');
  }
);

app.get('/perfil', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }

  res.send(<h1>Olá, ${req.user.username}.</h1>);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor está rodando em http://localhost:${PORT}`);
});