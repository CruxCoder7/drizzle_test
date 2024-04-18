import { boolean, integer, pgTable, serial, unique, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel } from "drizzle-orm";


export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
},
  (table) => {
    return {
      usersEmailKey: unique("users_email_key").on(table.email),
    };
  });

export const solutions = pgTable("solutions", {
  id: serial("id").primaryKey().notNull(),
  userId: integer("user_id").references(() => users.id),
  problemId: integer("problem_id").references(() => problems.id),
  solved: boolean("solved"),
},
  (table) => {
    return {
      solutionsUserIdProblemIdKey: unique("solutions_user_id_problem_id_key").on(table.userId, table.problemId),
    };
  });

export const problems = pgTable("problems", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }),
  difficulty: varchar("difficulty", { length: 50 }),
  topic: varchar("topic", { length: 100 }),
});

export type JoinedProblems = InferSelectModel<typeof problems> & {
  solved: boolean;
};