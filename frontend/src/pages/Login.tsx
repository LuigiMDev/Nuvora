import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@/states/user";
import { useShallow } from "zustand/react/shallow";

export default function Login() {
  const [user, setUser, isCheckingAuth] = useUser(
    useShallow((state) => [state.user, state.setUser, state.isCheckingAuth])
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && user) {
      navigate("/");
    }
  }, [user, isCheckingAuth, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Ocorreu um erro ao registrar o usuário!");
      }

      setUser(await res.json());

      toast.success("Login realizado!");
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        console.log(err.message);
      }
      setError("Erro ao criar conta. Tente novamente.");
      toast.error(
        "Ocorreu um erro ao entrar na sua conta! Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to={"/"}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <img
              src="/nuvora_logo.svg"
              className="w-full max-w-52 mx-auto mb-2"
            />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Entrar
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Bem-vindo de volta! Vamos às compras?
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Crie uma senha forte"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <Link
                  to={"/Register"}
                  className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Ao criar uma conta, você concorda com nossos termos e políticas de
            privacidade
          </p>
        </div>
      </div>
    </div>
  );
}
