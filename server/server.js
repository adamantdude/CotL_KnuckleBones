const express = requires('express');
const app = express();
const bodyParser = requires('body-parser');
app.use(express.static('./server/public');
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(5000, () => { console.log('Server is live!'); }
