"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("ScentMuse · 找到属于你的气味", {
        id: "welcome-toast",
        duration: 5000,
        position: "top-center",
        onAutoClose: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            概念试香产品 Demo，商品与价格均为演示样例。基于 Vercel Commerce 定制。{" "}
            <a
              href="https://vercel.com/templates/next.js/nextjs-commerce"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              查看原项目
            </a>
            .
          </>
        ),
      });
    }
  }, []);

  return null;
}
