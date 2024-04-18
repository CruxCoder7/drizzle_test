import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "~/server/db";
import { type JoinedProblems } from "~/server/db/schema";

export default async function HomePage() {
  const a = sql`
    SELECT
      p.id,
      p.name,
      p.link,
      p.difficulty,
      p.topic,
      COALESCE(s.solved, FALSE) AS solved
    FROM
        Problems p
    LEFT JOIN
        Solutions s ON p.id = s.problem_id AND s.user_id = 2;
  `;

  const res: JoinedProblems[] = await db.execute(a);
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center 
    bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white"
    >
      {res.map((d, o) => {
        return (
          <p className="text-lg capitalize" key={o}>
            {d.solved ? "t" : "f"}
          </p>
        );
      })}
      <form
        action={async () => {
          "use server";
          const u = sql`
            INSERT INTO Solutions (user_id, problem_id, solved)
            VALUES (2, 3, TRUE)
            ON CONFLICT (user_id, problem_id) DO UPDATE
            SET solved = TRUE;
          `;
          await db.execute(u);
          revalidatePath("/");
        }}
      >
        <button type="submit">Press</button>
      </form>
      <form
        action={async () => {
          "use server";
          const u = sql`
            INSERT INTO Solutions (user_id, problem_id, solved)
            VALUES (2, 3, FALSE)
            ON CONFLICT (user_id, problem_id) DO UPDATE
            SET solved = FALSE;
          `;
          await db.execute(u);
          revalidatePath("/");
        }}
      >
        <button type="submit">Press2</button>
      </form>
    </main>
  );
}
