'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/userStore";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import LoadingComponent from "@/components/Loader";

export type LoginDTO = {
    name: string;
    password: string;
};

export type LoginResponseDTO = {
    token: string;
};

const BASE_URL = process.env.API_URL || 'http://localhost:5097';

export default function LoginForm() {
    const router = useRouter();
    const store = useAppStore();

    const [err, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string>("");
    const [pwd, setPwd] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const requestOptions: RequestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email, password: pwd }),
                // credentials: 'include', // Includes cookies in the request
            };

            const response = await fetch(`${BASE_URL}/auth/login`, requestOptions);

            if (!response.ok) {
                setError("user or password incorrect");
                return;
            }

            const resp: LoginResponseDTO = await response.json();
            if (!resp?.token) {
                setError("user or password incorrect");
                return;
            }

            store.setUser(resp.token);
            // router.push(store.isAdmin() ? "cargotrack/dashboard" : "cargotrack/routes");
            router.push("check");
        } catch (e) {
            setError("user or password incorrect");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center min-h-screen max-h-screen">
            <Card className="mx-auto max-w-sm w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Introduce tu email para loguearte en tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="tu_email@cargotrack.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">
                                    Contraseña
                                </Label>
                                {/*
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    ¿Olvidate tu contraseña?
                                </Link>
                                */}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            {isLoading ? <LoadingComponent /> : "Login"}
                        </Button>

                        {err && (
                            <div className="text-red-500 text-sm mt-2">
                                Error al iniciar sesión. Comprueba tus credenciales.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}