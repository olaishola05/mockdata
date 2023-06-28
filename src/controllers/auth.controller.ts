import { Request, Response, NextFunction } from "express";
const bycrypt = require("bcrypt");
import { User, PrismaClient } from "@prisma/client";
import { asyncHandler, BadRequestError, NotFoundError, jwtTokenGenerator, createUserSchemaType, loginSchemaType } from "../utils";
import { authUser } from "types";

const authPrismaClient = new PrismaClient();

export const createUser = asyncHandler(
  async (req: Request<{}, {}, createUserSchemaType["body"]>, res: Response, next: NextFunction): Promise<void> => {
    const userData   = req.body;
    const { firstName, lastName, email, password, confirmPassword } = userData;

    const emailExist = await authPrismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (emailExist) {
      return next(new BadRequestError("Email or user already exist"));
    }

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return next(new BadRequestError("Please provide all required fields"));
    }

    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const hashedPasswordConfirmation = await bycrypt.hash(
      confirmPassword,
      salt
    );

    if (hashedPassword !== hashedPasswordConfirmation) {
        return next(new BadRequestError("Passwords does not match"));
    }

    const user: User = await authPrismaClient.user.create({
      data: { ...userData, 
        email: email.toLowerCase(),
        password: hashedPassword,
        confirmPassword: hashedPasswordConfirmation,
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
    async (req: Request<{}, {}, loginSchemaType["body"]>, res: Response, next: NextFunction): Promise<void> => {
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
            return next(new NotFoundError("user"));
        }

        const validPassword = await bycrypt.compare(password, user.password);

        if (!validPassword) {
            return next(new BadRequestError("Invalid password"));
        }

        const token = jwtTokenGenerator(user);        
        user.token = token;

        const {firstName, lastName, role, token: _token} = user as authUser;

        res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            data: {
                firstName,
                lastName,
                role,
                token: _token,
            }
        });
    }
);