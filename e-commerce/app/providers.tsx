"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMeRequest } from "@/store/login/action";

import type { ThemeProviderProps } from "next-themes";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import StoreProvider from "@/store/StoreProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMeRequest());
  }, [dispatch]);

  return <>{children}</>;
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <StoreProvider>
      <AuthLoader>
        <HeroUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </HeroUIProvider>
      </AuthLoader>
    </StoreProvider>
  );
}
