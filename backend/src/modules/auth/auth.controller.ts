import { Request, Response } from "express";
import * as authService from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.signup({
      name,
      email,
      password
    });

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json(result);

  } catch (error: any) {
    // Controlled errors
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    else if(error.message === "JWT_secret_not_defined") {
      return res.status(409).json({
        success: false,
        message: "No JWT secret"
      });
    }

    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};




export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({
      email,
      password
    });

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json(result);

  } catch (error: any) {
    // Controlled errors
    if (error.message === "INCORRECT_CREDENTIALS") {
      return res.status(409).json({
        success: false,
        message: "Incorrect credentials"
      });
    }
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};