import express from 'express';
import db from './config/Database.js';
import router from './route/UsersRoute.js';
import dotenv from 'dotenv'

dotenv.config();
const app = express()
app.use(express.urlencoded({extended : true}));

try {
    await db.authenticate();
    console.log('Database are Connected Successfully');
    await db.sync();
} catch (error) {
    console.error(error);
  
}
app.use(express.json());
app.use(router);

app.listen(6969, () => console.log('listening on port 6969'));



