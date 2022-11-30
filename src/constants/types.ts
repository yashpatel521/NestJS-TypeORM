export const roles = ["admin", "customer"];
export type rolesType = "admin" | "customer";
export enum rolesEnum {
  admin = "admin",
  customer = "customer",
}

export const modules = ["user", "role", "module", "permission"];
export type modulesType = "user" | "role" | "module" | "permission";
export enum modulesEnum {
  user = "user",
  role = "role",
  module = "module",
  permission = "permission",
}

export const permissions = ["post", "get", "patch", "delete"];
export type permissionsType = "post" | "get" | "patch" | "delete";
export enum permissionsEnum {
  post = "post",
  get = "get",
  patch = "patch",
  delete = "delete",
}

export type mailContextType = {
  subject: string;
  url: string;
  template: string;
};
