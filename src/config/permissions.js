export const ROLES = Object.freeze({
  USER: "user",
  MANAGER: "manager",
  ADMIN: "admin",
});

export const PERMISSIONS = Object.freeze({
  TASKS_READ_ANY: "tasks:read:any",
  TASKS_WRITE_ANY: "tasks:write:any",
  USERS_READ: "users:read",
  USERS_MANAGE: "users:manage",
});

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: [],
  [ROLES.MANAGER]: [PERMISSIONS.TASKS_READ_ANY],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
