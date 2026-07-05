import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";

export const metadata = {
  title: "Admin Login | Blackboard Cafe",
};

async function loginAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw err;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/admin");

  const { error } = await searchParams;

  const fieldClasses =
    "w-full rounded-[10px] border-[1.5px] border-card-border bg-cream-input px-4 py-3.5 font-body text-sm text-heading focus:border-gold focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 font-body">
      <div className="w-full max-w-[420px] rounded-[20px] border border-card-border bg-surface p-9 sm:p-11">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex flex-col items-center rounded-[14px] bg-dark px-5 pt-2.5 pb-2">
            <div className="font-display text-lg leading-none font-extrabold tracking-[0.5px] text-gold">
              BLACKBOARD
            </div>
            <div className="mt-0.5 font-display text-sm leading-none font-bold tracking-[2px] text-white">CAFE</div>
          </div>
          <h1 className="m-0 font-display text-xl font-bold text-heading">Admin Login</h1>
          <p className="m-0 mt-1 text-sm text-muted">Sign in to manage reservations and inquiries.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
            Invalid email or password.
          </div>
        )}

        <form action={loginAction}>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Email</label>
            <input name="email" type="email" required placeholder="admin@blackboard.cafe" className={fieldClasses} />
          </div>
          <div className="mb-7">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Password</label>
            <input name="password" type="password" required placeholder="••••••••" className={fieldClasses} />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg border-none px-9 py-4 font-body text-sm font-bold tracking-[0.5px] text-dark shadow-[0_4px_0_#C97F16]"
            style={{ background: "#F2A93B", cursor: "pointer" }}
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}
