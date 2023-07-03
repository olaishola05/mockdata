import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { userRouter, taskRouter, authRouter } from './routes';
import { errorResponse, errorLogging } from './middleware';
import * as cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors.default());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API',
  });
});


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  errorResponse(req, res, next, err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  errorLogging(err, req, res, next);
});

app.listen(port, () => {
  console.log(`Server running on at http://localhost:${port}`);
}
);