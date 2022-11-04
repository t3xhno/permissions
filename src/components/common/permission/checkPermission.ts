import { getUser } from "../../../composables/useUser";

export interface IConfig {
  debug?: boolean;
  noAccessRedirect?: string;
  type?: "one-of" | "all-of";
  entityOwnerId?: number | string;
};

export type TRoles = string[];

/**
 * Return an array method for check type
 * 
 * For one-of we only need to find one record, so .some is sufficient
 * For all-of we want to match all roles, so we use .every
 */
const permissionCheckTypeMethods = {
  "one-of": (roles: string[]) => roles.some,
  "all-of": (roles: string[]) => roles.every,
};

export type CheckPermission = (roles: TRoles, config: IConfig) => boolean;
export const checkPermission: CheckPermission = (roles, config = {}) => {
  /**
   * By default the type is "one-of"
   * entityOwnerId is only needed when checking if a user
   * is an owner of an entity such as comment, post, etc
   */
  const { type = "one-of", entityOwnerId, debug } = config;

  // Get an array method for checking permissions
  const checkMethod =
    permissionCheckTypeMethods?.[type] ||
    permissionCheckTypeMethods["one-of"];
  
  const user = getUser();
  const userRoles = user.value?.roles || [];

  /**
   * Initialize checkMethod to get reference to .some or .every
   * We need to bind the 'roles' array to make sure these functions are
   * run in the context of the array prototype.
   */
  const hasAccess = checkMethod(roles).bind(roles)(role => {
    // Check if user created a record
    if (role === "owner") return user.value?.id === entityOwnerId;
    // Checks if user is authenticated
    if (role === "logged-in") return Boolean(user.value?.id);
    // Check other roles
    return userRoles.includes(role);
  });

  debug && console.log("PERMISSION_DEBUG", {
    hasAccess,
    requiredRoles: roles,
    userRoles: userRoles,
    type,
    entityOwnerId,
  });

  return hasAccess;
};
