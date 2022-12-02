export const roles = ["admin", "customer"];
export type rolesType = "admin" | "customer";
export enum rolesEnum {
  admin = "admin",
  customer = "customer",
}

export const modules = ["user", "role", "permission"];
export type modulesType = "user" | "role" | "permission";
export enum modulesEnum {
  user = "user",
  role = "role",
  permission = "permission",
}

export const subPermissions = ["post", "get", "patch", "delete"];
export type subPermissionsType = "post" | "get" | "patch" | "delete";
export enum subPermissionsEnum {
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
