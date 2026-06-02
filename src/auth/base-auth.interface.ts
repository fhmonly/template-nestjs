export type JWTPayload<T extends Record<string, any> = Record<string, any>> =
  T & {
    sub: string;
  };
export type AccessTokenPayload<
  T extends Record<string, unknown> = Record<string, unknown>,
> = JWTPayload<T>;

export type RefreshTokenPayload<
  T extends Record<string, unknown> = Record<string, unknown>,
> = JWTPayload<T> & {
  jti: string;
};
