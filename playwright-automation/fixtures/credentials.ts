export type Brand = 'NCL' | 'OCEANIA' | 'REGENT';
export type Role  = 'admin' | 'manager' | 'analyst';

export interface UserCredentials {
  username: string | undefined;
  password: string | undefined;
  sq:       string | undefined;
}

export const credentials: Record<Brand, Record<Role, UserCredentials>> = {
  NCL: {
    admin: {
      username: process.env.OKTA_USERNAME_NCL_ADMIN,
      password: process.env.OKTA_PASSWORD_NCL_ADMIN,
      sq:       process.env.OKTA_SQ_NCL_ADMIN,
    },
    manager: {
      username: process.env.OKTA_USERNAME_NCL_MANAGER,
      password: process.env.OKTA_PASSWORD_NCL_MANAGER,
      sq:       process.env.OKTA_SQ_NCL_MANAGER,
    },
    analyst: {
      username: process.env.OKTA_USERNAME_NCL_ANALYST,
      password: process.env.OKTA_PASSWORD_NCL_ANALYST,
      sq:       process.env.OKTA_SQ_NCL_ANALYST,
    },
  },
  OCEANIA: {
    admin: {
      username: process.env.OKTA_USERNAME_OCEANIA_ADMIN,
      password: process.env.OKTA_PASSWORD_OCEANIA_ADMIN,
      sq:       process.env.OKTA_SQ_OCEANIA_ADMIN,
    },
    manager: {
      username: process.env.OKTA_USERNAME_OCEANIA_MANAGER,
      password: process.env.OKTA_PASSWORD_OCEANIA_MANAGER,
      sq:       process.env.OKTA_SQ_OCEANIA_MANAGER,
    },
    analyst: {
      username: process.env.OKTA_USERNAME_OCEANIA_ANALYST,
      password: process.env.OKTA_PASSWORD_OCEANIA_ANALYST,
      sq:       process.env.OKTA_SQ_OCEANIA_ANALYST,
    },
  },
  REGENT: {
    admin: {
      username: process.env.OKTA_USERNAME_REGENT_ADMIN,
      password: process.env.OKTA_PASSWORD_REGENT_ADMIN,
      sq:       process.env.OKTA_SQ_REGENT_ADMIN,
    },
    manager: {
      username: process.env.OKTA_USERNAME_REGENT_MANAGER,
      password: process.env.OKTA_PASSWORD_REGENT_MANAGER,
      sq:       process.env.OKTA_SQ_REGENT_MANAGER,
    },
    analyst: {
      username: process.env.OKTA_USERNAME_REGENT_ANALYST,
      password: process.env.OKTA_PASSWORD_REGENT_ANALYST,
      sq:       process.env.OKTA_SQ_REGENT_ANALYST,
    },
  },
};
