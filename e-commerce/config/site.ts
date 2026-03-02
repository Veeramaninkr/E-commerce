export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "E-Commerce",
  description: "Welcome to our E-Commerce website",
  navItems: [
    {
      label: "Home",
      href: "/client/home",
    },
    {
      label: "Products",
      href: "#products",
    },
    {
      label: "Contact",
      href: "#contact",
    },
    {
      label: "About",
      href: "#about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/client/user",
    },
    {
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Track Orders",
      href: "/client/track",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
