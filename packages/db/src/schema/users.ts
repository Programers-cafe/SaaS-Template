import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";

export type JsonObject = {
  [Key in string]?: JsonValue;
};
/**
* JSON Array
*/
export type JsonArray = JsonValue[];
/**
* JSON Primitives
*/
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export interface AuthorizationDetails {
  readonly type: string;
  readonly locations?: string[];
  readonly actions?: string[];
  readonly datatypes?: string[];
  readonly privileges?: string[];
  readonly identifier?: string;
  readonly [parameter: string]: JsonValue | undefined;
}


export interface OpenIDTokenEndpointResponse {
  readonly access_token: string;
  readonly expires_in?: number;
  readonly id_token: string;
  readonly refresh_token?: string;
  readonly scope?: string;
  readonly authorization_details?: AuthorizationDetails[];
  /**
   * NOTE: because the value is case insensitive it is always returned lowercased
   */
  readonly token_type: 'bearer' | 'dpop' | Lowercase<string>;
  readonly [parameter: string]: JsonValue | undefined;
}

export interface AdapterAccount extends Account {
  userId: string
  type: Extract<ProviderType, "oauth" | "oidc" | "email" | "webauthn">
}

export type WebAuthnProviderType = "webauthn"
export type ProviderType =
  | "oidc"
  | "oauth"
  | "email"
  | "credentials"
  | WebAuthnProviderType

export interface Account extends Partial<OpenIDTokenEndpointResponse> {
  /** Provider's id for this account. Eg.: "google" */
  provider: string
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth/oidc: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string
  /** Provider's type for this account */
  type: ProviderType
  /**
   * id of the user this account belongs to
   *
   * @see https://authjs.dev/reference/core/adapters#adapteruser
   */
  userId?: string
  /**
   * Calculated value based on {@link OAuth2TokenEndpointResponse.expires_in}.
   *
   * It is the absolute timestamp (in seconds) when the {@link OAuth2TokenEndpointResponse.access_token} expires.
   *
   * This value can be used for implementing token rotation together with {@link OAuth2TokenEndpointResponse.refresh_token}.
   *
   * @see https://authjs.dev/guides/refresh-token-rotation#database-strategy
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
   */
  expires_at?: number
}


export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);