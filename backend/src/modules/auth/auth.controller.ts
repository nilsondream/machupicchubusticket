import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.service";

// Schemas de validación
const registerSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Configuración de cookies
const isProduction = process.env.NODE_ENV === "production";

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 15 * 60 * 1000, // 15 minutos
  path: "/",
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: "/auth",
};

// Utilidades para firmar tokens
const generateAccessToken = (user: { id: string; email: string; name: string | null; role: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (user: { id: string }) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
};

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Datos de registro inválidos",
          errors: parsed.error.format(),
        });
        return;
      }

      const { email, password, name } = parsed.data;

      // Verificar si el usuario ya existe
      const existingUser = await AuthService.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: "El correo electrónico ya está registrado" });
        return;
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await AuthService.createUser({ email, passwordHash, name });

      // Generar tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Establecer cookies
      res.cookie("accessToken", accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      res.status(201).json({
        user,
        accessToken,
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).json({ message: "Error interno del servidor en el registro" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          message: "Datos de login inválidos",
          errors: parsed.error.format(),
        });
        return;
      }

      const { email, password } = parsed.data;

      // Buscar usuario
      const user = await AuthService.findByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Credenciales incorrectas" });
        return;
      }

      // Comparar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Credenciales incorrectas" });
        return;
      }

      // Datos públicos del usuario
      const userPublic = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      // Generar tokens
      const accessToken = generateAccessToken(userPublic);
      const refreshToken = generateRefreshToken(userPublic);

      // Establecer cookies
      res.cookie("accessToken", accessToken, accessTokenCookieOptions);
      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      res.status(200).json({
        user: userPublic,
        accessToken,
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({ message: "Error interno del servidor en el login" });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("accessToken", { ...accessTokenCookieOptions, maxAge: 0 });
      res.clearCookie("refreshToken", { ...refreshTokenCookieOptions, maxAge: 0 });
      res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
      console.error("Error en logout:", error);
      res.status(500).json({ message: "Error interno del servidor al cerrar sesión" });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "No autenticado" });
        return;
      }

      const user = await AuthService.findById(req.user.id);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error en me:", error);
      res.status(500).json({ message: "Error al obtener perfil de usuario" });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "Acceso no autorizado: No hay token de refresco" });
        return;
      }

      // Verificar token
      let payload: any;
      try {
        payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      } catch (err) {
        res.status(401).json({ message: "Acceso no autorizado: Token de refresco inválido o expirado" });
        return;
      }

      // Buscar usuario
      const user = await AuthService.findById(payload.id);
      if (!user) {
        res.status(401).json({ message: "Usuario no encontrado" });
        return;
      }

      // Generar nuevo access token
      const accessToken = generateAccessToken(user);

      // Actualizar cookie de access token
      res.cookie("accessToken", accessToken, accessTokenCookieOptions);

      res.status(200).json({
        user,
        accessToken,
      });
    } catch (error) {
      console.error("Error en refresh:", error);
      res.status(500).json({ message: "Error interno del servidor al refrescar token" });
    }
  }
}
