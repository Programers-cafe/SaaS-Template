"use client";

import { useBalance } from "@saas/store";

export default function() {
  const balance = useBalance();
  return <div>
    hi there {balance}
  </div>
}