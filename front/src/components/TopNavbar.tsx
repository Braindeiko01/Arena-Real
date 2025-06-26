"use client";

import { useAuth } from "@/hooks/useAuth";

const TopNavbar = () => {
  const { user } = useAuth();
  const balance = user?.balance ?? 0;

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(balance);

  return (
    <header className="md:hidden flex justify-between items-center px-4 py-2 bg-[#3973FF]">
      <span className="font-bold text-white">Arena Real</span>
      <span className="text-[#FFD600]">{formatted}</span>
    </header>
  );
};

export default TopNavbar;
