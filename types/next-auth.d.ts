import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "LEARNER" | "PARENT" | "EDUCATOR" | "PARENT_EDUCATOR" | "ADMIN";
    };
  }

  interface User {
    id: string;
    role: "LEARNER" | "PARENT" | "EDUCATOR" | "PARENT_EDUCATOR" | "ADMIN";
  }
}
