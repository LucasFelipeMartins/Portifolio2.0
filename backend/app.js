const express = require('express');
const cors = require('cors');
const path = require('path');
const mustacheExpress = require('mustache-express');
const analyticsMiddleware = require('./middlewares/analyticsMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const apiRoutes = require('./routes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.engine('mustache', mustacheExpress(path.join(__dirname, 'views', 'partials'), '.mustache'));
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(analyticsMiddleware);
app.use('/', viewRoutes);
app.use('/api', apiRoutes);
app.use(errorHandler);

module.exports = app;
