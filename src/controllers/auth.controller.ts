import { Request, Response, NextFunction } from "express";
const bycrypt = require("bcrypt");
import { User, PrismaClient } from "@prisma/client";
import { asyncHandler, BadRequestError, jwtTokenGenerator } from "../utils";

const authPrismaClient = new PrismaClient();

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userData: User = req.body;
    const { firstName, lastName, email, password } = userData;

    const emailExist = await authPrismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExist) {
      return next(new BadRequestError("Email or user already exist"));
    }

    if (!firstName || !lastName || !email || !password) {
      return next(new BadRequestError("Please provide all required fields"));
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const user: User = await authPrismaClient.user.create({
      data: { ...userData, 
        email: email.toLowerCase(),
        password: hashedPassword,
    }
    });

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  }
);

export const loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new BadRequestError("Please provide all required fields"));
        }

        const user: User | null = await authPrismaClient.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return next(new BadRequestError("Invalid email or password"));
        }

        const validPassword = await bycrypt.compare(password, user.password);

        if (!validPassword) {
            return next(new BadRequestError("Invalid password"));
        }

        const token = jwtTokenGenerator(user);
        user.token = token;

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: user.token,
        });
    }
);