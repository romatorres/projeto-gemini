import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo ao Projeto Gemini</h1>
      <div className="flex space-x-4">
        <Link href="/login" passHref>
          <Button>Login</Button>
        </Link>
        <Link href="/register" passHref>
          <Button variant="secondary">Registro</Button>
        </Link>
      </div>
    </main>
  );
}
