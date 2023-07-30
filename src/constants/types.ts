export const roles = ["admin", "user"];
export type rolesType = "admin" | "user";
export enum rolesEnum {
  admin = "admin",
  user = "user",
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
