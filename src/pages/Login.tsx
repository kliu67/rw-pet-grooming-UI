import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { useCreateUser } from "@/hooks/auth";
import { useLogin } from "@/hooks/auth";
import {
  MAX_EMAIL_LENGTH,
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_PHONE_LENGTH,
  MIN_PHONE_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  emailRegex,
  phoneRegex,
  passwordRegex,
  lastNameRegex,
  firstNameRegex,
} from "@/constants";

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  last_name: string;
  first_name: string;
  phone: string;
};

type RegisterFormData = Omit<RegisterFormValues, "confirmPassword">;

export const Login = () => {
  const [activeTab, setActiveTab] = useState<string>("login");

  const loginForm = useForm<LoginFormData>({mode: "onBlur", reValidateMode: "onChange"});
  const registerForm = useForm<RegisterFormValues>({mode: "onBlur", reValidateMode: "onChange" });
  const { t } = useTranslation();
  const password = registerForm.watch("password");

  const createUserMutation = useCreateUser();
  const loginMutation = useLogin();
  const onLogin = async (data: LoginFormData) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      console.log("Login:", { email: data.email });
      console.log("Login status:", result?.status);
      toast.success("Login successful!");
    } catch (err) {
      if (err?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err?.status === 400) {
        toast.error("Invalid login request");
      } else {
        toast.error(
          `Login failed: ${err?.status} - ${err?.message || err?.error}`,
        );
      }
      console.log(err);
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    const { confirmPassword, ...rest } = data;
    const payload: RegisterFormData = {
      ...rest,
    };
    try {
      const result = await createUserMutation.mutateAsync(payload);

      console.log("Register:", payload);
      console.log("Register status:", result?.status);
      toast.success("Registration successful!");
      setActiveTab("login");
    } catch (err) {
      if (err?.status === 409) {
        toast.error("Account with this email already exists");
      } else {
        toast.error(
          `Registration failed: ${err?.status} - ${err?.message || err?.error}`,
        );
        console.log(err);
      }
    }
  };

  return (
    <>
      <Toaster />
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>{t("login.heading")}</CardTitle>
            <CardDescription>{t("login.subHeading")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("login.login")}</TabsTrigger>
                <TabsTrigger value="register">
                  {t("login.register")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    loginForm.handleSubmit(onLogin)(e);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t("login.email")}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      {...loginForm.register("email", {
                        required: t("login.required", {
                          field: t("login.email"),
                        }),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">
                      {t("login.password")}
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register("password", {
                        required: t("login.required", {
                          field: t("login.password"),
                        }),
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                    aria-busy={loginMutation.isPending}
                  >
                    {loginMutation.isPending
                      ? `${t("login.login")}...`
                      : t("login.login")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form
                  onSubmit={registerForm.handleSubmit(onRegister)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t("login.email")}</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      {...registerForm.register("email", {
                        required: t("login.required", {
                          field: t("login.email"),
                        }),
                        pattern: {
                          value: emailRegex,
                          message: t("login.emailFormatError"),
                        },
                        maxLength: {
                          value: MAX_EMAIL_LENGTH,
                          message: t("login.emailMaxLengthError", {
                            length: MAX_EMAIL_LENGTH,
                          }),
                        },
                      })}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">
                      {t("login.password")}
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("password", {
                        required: t("login.required", {
                          field: t("login.password"),
                        }),
                        pattern: {
                          value: passwordRegex,
                          message: t("login.passwordError"),
                        },
                        minLength: {
                          value: MIN_PASSWORD_LENGTH,
                          message: t("login.passwordMinLengthError", {
                            length: MIN_PASSWORD_LENGTH,
                          }),
                        },
                        maxLength: {
                          value: MAX_PASSWORD_LENGTH,
                          message: t("login.passwordMaxLengthError", {
                            length: MAX_PASSWORD_LENGTH,
                          }),
                        },
                      })}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">
                      {t("login.confirmPassword")}
                    </Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("confirmPassword", {
                        required: t("login.confirmPasswordRequired"),
                        validate: (value) =>
                          value === password || t("login.passwordMatchError"),
                      })}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-first-name">
                      {t("login.firstName")}
                    </Label>
                    <Input
                      id="register-first-name"
                      type="text"
                      placeholder={t("login.firstName")}
                      {...registerForm.register("first_name", {
                        required: t("login.required", {
                          field: t("login.firstName"),
                        }),
                        pattern: {
                          value: firstNameRegex,
                          message: t("login.fieldLengthError", {
                            field: t("login.firstName"),
                            length: MAX_FIRST_NAME_LENGTH,
                          }),
                        },
                      })}
                    />
                    {registerForm.formState.errors.first_name && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.first_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-last-name">
                      {t("login.lastName")}
                    </Label>
                    <Input
                      id="register-last-name"
                      type="text"
                      placeholder={t("login.lastName")}
                      {...registerForm.register("last_name", {
                        required: t("login.required", {
                          field: t("login.lastName"),
                        }),
                        pattern: {
                          value: lastNameRegex,
                          message: t("login.fieldLengthError", {
                            field: t("login.lastName"),
                            length: MAX_LAST_NAME_LENGTH,
                          }),
                        },
                      })}
                    />
                    {registerForm.formState.errors.last_name && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.last_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone">{t("login.phone")}</Label>
                    <Input
                      id="register-phone"
                      type="text"
                      placeholder={t("login.phone")}
                      inputMode="tel"
                      {...registerForm.register("phone", {
                        required: t("login.required", {
                          field: t("login.phone"),
                        }),
                        pattern: {
                          value: phoneRegex,
                          message: t("login.phoneFormatError"),
                        },
                        minLength: {
                          value: MIN_PHONE_LENGTH,
                          message: t("login.phoneMinLengthError", {
                            length: MIN_PHONE_LENGTH,
                          }),
                        },
                        maxLength: {
                          value: MAX_PHONE_LENGTH,
                          message: t("login.phoneMaxLengthError", {
                            length: MAX_PHONE_LENGTH,
                          }),
                        },
                      })}
                    />
                    {registerForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">
                        {registerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createUserMutation.isPending}
                    aria-busy={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending
                      ? `${t("login.createAccount")}...`
                      : t("login.createAccount")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
