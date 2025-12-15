import { LoginForm } from "@/components/auth/login-form";
import { SITE_NAME } from "@/lib/secret";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-card sm:p-7 p-5 rounded-lg sm:border sm:shadow-lg">
        <div className="space-y-2">
          <h1 className="sm:text-3xl text-2xl font-bold tracking-tight text-balance max-sm:text-center">
            Welcome to {SITE_NAME}
          </h1>
          <p className="text-muted-foreground text-base max-sm:text-center">
            Enter your credentials to access the project management system
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
