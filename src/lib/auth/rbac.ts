export const APP_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const APP_PERMISSIONS = [
  "dashboard:view",
  "pages:view",
  "pages:edit",
  "leads:view",
  "settings:manage",
] as const;
export type AppPermission = (typeof APP_PERMISSIONS)[number];

const rolePermissionsMap: Record<AppRole, AppPermission[]> = {
  ADMIN: ["dashboard:view", "pages:view", "pages:edit", "leads:view", "settings:manage"],
  EDITOR: ["dashboard:view", "pages:view", "pages:edit"],
  VIEWER: ["dashboard:view", "pages:view", "leads:view"],
};

const adminRoutePermissions: { pattern: RegExp; permission: AppPermission }[] = [
  { pattern: /^\/admin$/, permission: "dashboard:view" },
  { pattern: /^\/admin\/pages$/, permission: "pages:view" },
  { pattern: /^\/admin\/cases$/, permission: "pages:view" },
  { pattern: /^\/admin\/leads$/, permission: "leads:view" },
  { pattern: /^\/admin\/settings$/, permission: "settings:manage" },
];

export const hasPermission = (role: AppRole, permission: AppPermission) => {
  return rolePermissionsMap[role].includes(permission);
};

export const getRolePermissions = (role: AppRole) => rolePermissionsMap[role];

export const getAdminRouteRequiredPermission = (pathname: string): AppPermission | null => {
  const match = adminRoutePermissions.find((routeRule) => routeRule.pattern.test(pathname));
  return match ? match.permission : null;
};
