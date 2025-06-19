import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@/states/user";
import { useShallow } from "zustand/react/shallow";

export default function Register() {
  const [user, setUser, isCheckingAuth] = useUser(
    useShallow((state) => [state.user, state.setUser, state.isCheckingAuth])
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckingAuth && !user) {
      toast.warn("É preciso estar logado para acessar esta página!");
      navigate("/");
    }
  }, [user, isCheckingAuth, navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
      });
    }

    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Por favor, insira seu nome completo.");
      return false;
    }

    if (!formData.email || !formData.email.includes("@")) {
      setError("Por favor, insira um e-mail válido.");
      return false;
    }

    if (formData.password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }

    if (!acceptTerms) {
      setError("Você deve aceitar os termos de uso.");
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
        `${import.meta.env.VITE_BACKEND_URL}/user/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Ocorreu um erro ao registrar o usuário!");
      }

      setUser(await res.json());

      toast.success("Conta criada com sucesso");
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        console.log(err.message);
      }
      setError("Erro ao criar conta. Tente novamente.");
      toast.error("Ocorreu um erro ao criar sua conta!");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const strength = Object.values(passwordStrength).filter(Boolean).length;
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    const strength = Object.values(passwordStrength).filter(Boolean).length;
    if (strength <= 1) return "Fraca";
    if (strength <= 2) return "Regular";
    if (strength <= 3) return "Boa";
    return "Forte";
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
              Criar sua conta
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Junte-se a nós e comece a comprar hoje mesmo
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
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

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

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{
                            width: `${
                              (Object.values(passwordStrength).filter(Boolean)
                                .length /
                                4) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {getPasswordStrengthText()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        className={`flex items-center gap-1 ${
                          passwordStrength.length
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        8+ caracteres
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          passwordStrength.uppercase
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        Letra maiúscula
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          passwordStrength.lowercase
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        Letra minúscula
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          passwordStrength.number
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        Número
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      As senhas não coincidem
                    </p>
                  )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(e) => setAcceptTerms(e === true)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-5"
                >
                  Eu aceito os{" "}
                  <Link
                    to="#"
                    className="text-[var(--primary)] hover:underline"
                  >
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link
                    to="#"
                    className="text-[var(--primary)] hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-gray-600">
                Já tem uma conta?{" "}
                <Link
                  to={"/Login"}
                  className="text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium transition-colors"
                >
                  Fazer login
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
