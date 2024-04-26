// import type {
//   GetServerSidePropsContext,
//   NextApiRequest,
//   NextApiResponse,
// } from "next";
// // import { KyselyAdapter } from "@auth/kysely-adapter";  Replace with drizle
// import { getServerSession, type NextAuthOptions, type User } from "next-auth";
// import EmailProvider from "next-auth/providers/email";
// import GitHubProvider from "next-auth/providers/github";

// // import { MagicLinkEmail, resend, siteConfig } from "@saasfly/common";  //email system 

// import { db } from "@saas/db";
// import { DrizzleAdapter } from "@auth/drizzle-adapter";

// type UserId = string;
// type IsAdmin = boolean;

// declare module "next-auth" {
//   interface Session {
//     user: User & {
//       id: UserId;
//       isAdmin: IsAdmin;
//     };
//   }
// }

// declare module "next-auth" {
//   interface JWT {
//     isAdmin: IsAdmin;
//   }
// }
// const VERCEL_DEPLOYMENT = 'http://localhost:3002';
// console.log(process.env.GITHUB_CLIENT_ID!)
// export const authOptions: NextAuthOptions = {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-expect-error
//   adapter: DrizzleAdapter(db),
//   providers: [
//     GitHubProvider({
//       clientId:'d46c19d82b5a48ef0489',
//       clientSecret: '86dc5a38a5e4d9a75435a1616068f58f72dd17f5',
//     }),
//     // EmailProvider({
//     //   sendVerificationRequest: async ({ identifier, url }) => {
//     //     const user = await db
//     //       .selectFrom("User")
//     //       .select(["name", "emailVerified"])
//     //       .where("email", "=", identifier)
//     //       .executeTakeFirst();
//     //     const userVerified = !!user?.emailVerified;
//     //     const authSubject = userVerified
//     //       ? `Sign-in link for ${(siteConfig as { name: string }).name}`
//     //       : "Activate your account";

//     //     try {
//     //       await resend.emails.send({
//     //         from: env.RESEND_FROM,
//     //         to: identifier,
//     //         subject: authSubject,
//     //         react: MagicLinkEmail({
//     //           firstName: user?.name ?? "",
//     //           actionUrl: url,
//     //           mailType: userVerified ? "login" : "register",
//     //           siteName: (siteConfig as { name: string }).name,
//     //         }),
//     //         // Set this to prevent Gmail from threading emails.
//     //         // More info: https://resend.com/changelog/custom-email-headers
//     //         headers: {
//     //           "X-Entity-Ref-ID": new Date().getTime() + "",
//     //         },
//     //       });
//     //     } catch (error) {
//     //       console.log(error);
//     //     }
//     //   },
//     // }),
//   ],
//   session: { strategy: "jwt" },
//   cookies: {
//     sessionToken: {
//       name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
//         domain: VERCEL_DEPLOYMENT
//           ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
//           : undefined,
//         secure: VERCEL_DEPLOYMENT,
//       },
//     },
//   },
//   pages: {
//     error: "/login",
//   },
//   secret: process.env.JWT_SECRET || "secret",
//   callbacks: {
//     // signIn: async ({ user, account, profile }) => {
//     //   console.log({ user, account, profile });
//     //   // if (!user.email || (await isBlacklistedEmail(user.email))) {
//     //   //   return false;
//     //   // }
//     //   if (account?.provider === "google" || account?.provider === "github") {
//     //     const userExists = await prisma.user.findUnique({
//     //       where: { email: user.email },
//     //       select: { id: true, name: true, image: true },
//     //     });
//     //     if (!userExists || !profile) {
//     //       return true;
//     //     }
//     //     // if the user already exists via email,
//     //     // update the user with their name and image
//     //     // if (userExists && profile) {
//     //     //   // const profilePic =
//     //     //   //   profile[account.provider === "google" ? "picture" : "avatar_url"];
//     //     //   let newAvatar: string | null = null;
//     //     //   // if the existing user doesn't have an image or the image is not stored in R2
//     //     //   if (
//     //     //     (!userExists.image || !isStored(userExists.image)) &&
//     //     //     profilePic
//     //     //   ) {
//     //     //     const { url } = await storage.upload(
//     //     //       `avatars/${userExists.id}`,
//     //     //       profilePic,
//     //     //     );
//     //     //     newAvatar = url;
//     //     //   }
//     //     //   await prisma.user.update({
//     //     //     where: { email: user.email },
//     //     //     data: {
//     //     //       // @ts-expect-error - this is a bug in the types, `login` is a valid on the `Profile` type
//     //     //       ...(!userExists.name && { name: profile.name || profile.login }),
//     //     //       ...(newAvatar && { image: newAvatar }),
//     //     //     },
//     //     //   });
//     //     // }
//     //   }
//     //   return true;
//     // },
//     jwt: async ({ token, user, trigger }) => {
//       if (user) {
//         token.user = user;
//       }

//       // refresh the user's data if they update their name / email
//       if (trigger === "update") {
//         const refreshedUser = await db.insert.user({
//           where: { id: token.sub },
//         });
//         if (refreshedUser) {
//           token.user = refreshedUser;
//         } else {
//           return {};
//         }
//       }

//       return token;
//     },
//     session: async ({ session, token }) => {
//       session.user = {
//         id: token.sub,
//         // @ts-ignore
//         ...(token || session).user,
//       };
//       return session;
//     },
//   },


// }