import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "LEARNER" | "PARENT" | "EDUCATOR" | "PARENT_EDUCATOR" | "ADMIN";
    };
  }

  interface User {
    id?: string;
    role?: "LEARNER" | "PARENT" | "EDUCATOR" | "PARENT_EDUCATOR" | "ADMIN";
  }
}
