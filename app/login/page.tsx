"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect direttamente alla dashboard
    router.push("/dashboard");
  }, [router]);

  return <div>Reindirizzamento...</div>;
}