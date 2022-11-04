import { IConfig, TRoles } from "./components/common/permission/checkPermission";

export interface IPermissions {
  roles: TRoles;
  config: IConfig;
};

declare module "vue-router" {
  interface RouteMeta {
    permission?: IPermissions;
  };
};
