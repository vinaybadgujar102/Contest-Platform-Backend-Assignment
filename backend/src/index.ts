import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { AppError } from "./utils/app.error";
import { errorResponse } from "./utils/response.utils";
import { StatusCodes } from "http-status-codes";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return errorResponse(res, error.statusCode, error.errorCode);
  }

  return errorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    "INTERNAL_SERVER_ERROR",
  );
});

app.listen(3000, () => {
  console.log("listening on port: ", 3000);
});
