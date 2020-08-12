require('dotenv').config();
const { app } = require('./routes.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});