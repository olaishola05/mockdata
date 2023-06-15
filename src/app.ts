import express from 'express';
import { userRouter, processRouter } from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/processes', processRouter);

app.listen(port, () => {
  console.log(`Server running on at http://localhost:${port}`);
}
);