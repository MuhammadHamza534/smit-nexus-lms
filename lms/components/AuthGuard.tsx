"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/data";

interface Props {
  children: ReactNode;
  role: Role;
}

export default function AuthGuard({ children, role }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("lms-user");

    if (!stored) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(stored);

      if (user.role !== role) {
        router.replace("/");
        return;
      }

      setAllowed(true);
    } catch {
      router.replace("/");
    }
  }, [role, router]);

  if (!allowed) {
    return (
      <div className="min-h-screen grid place-items-center text-[#8e9bb0]">
        Loading portal...
      </div>
    );
  }

  return children;
}