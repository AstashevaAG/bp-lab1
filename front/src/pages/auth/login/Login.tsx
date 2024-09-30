import { AuthForm } from "./auth-form/AuthForm";

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center formContainer">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <img src="/public/auth-logo.png" alt="" className="mb-73" draggable={false}/>

        <AuthForm isLogin />
      </div>
    </div>
  );
}
