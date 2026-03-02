import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname === "/admin/login") {
        return true;
      }
      return token?.role === "ADMIN";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
