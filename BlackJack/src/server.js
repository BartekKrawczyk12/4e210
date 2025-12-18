const app = require('./app');
const { connectDB } = require('./data/connection');
const PORT = 3000;

app.use((req, res, next) => {
    res.locals.query = req.query;
    next();
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
});
