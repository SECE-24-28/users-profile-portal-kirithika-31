import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resolvers = {
  Query: {
    students: async () => {
      return await prisma.student.findMany();
    },

    student: async (
      _: unknown,
      { id }: { id: number }
    ) => {
      return await prisma.student.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    signup: async (
      _: unknown,
      {
        email,
        password,
      }: {
        email: string;
        password: string;
      }
    ) => {
      const existingAdmin =
        await prisma.admin.findUnique({
          where: { email },
        });

      if (existingAdmin) {
        throw new Error("Admin already exists");
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const admin =
        await prisma.admin.create({
          data: {
            email,
            password: hashedPassword,
          },
        });

      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          role: "ADMIN",
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return { token };
    },

    login: async (
      _: unknown,
      {
        email,
        password,
      }: {
        email: string;
        password: string;
      }
    ) => {
      const admin =
        await prisma.admin.findUnique({
          where: { email },
        });

      if (!admin) {
        throw new Error("Admin not found");
      }

      const validPassword =
        await bcrypt.compare(
          password,
          admin.password
        );

      if (!validPassword) {
        throw new Error("Invalid password");
      }

      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          role: "ADMIN",
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return { token };
    },

    addStudent: async (
      _: unknown,
     args: {
  name: string;
  email: string;
  password: string;
  department: string;
  year: number;
  image?: string;
},
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      const hashedPassword =
        await bcrypt.hash(
          args.password,
          10
        );

      return await prisma.student.create({
        data: {
          ...args,
          password: hashedPassword,
        },
      });
    },

    updateStudent: async (
      _: unknown,
      {
        id,
        ...data
      }: {
        id: number;
        name?: string;
        department?: string;
        year?: number;
        image?: string;
      },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      return await prisma.student.update({
        where: { id },
        data,
      });
    },

    deleteStudent: async (
      _: unknown,
      { id }: { id: number },
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }

      await prisma.student.delete({
        where: { id },
      });

      return "Student deleted successfully";
    },
  },
};