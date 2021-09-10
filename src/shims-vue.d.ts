declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "lodash";
declare module "unicode-bidirectional";
declare module "vue-virtual-scroller" {
  import Vue, { ComponentOptions, PluginObject, Component } from "vue";
  interface PluginOptions {
    installComponents?: boolean;
    componentsPrefix?: string;
  }

  const plugin: PluginObject<PluginOptions> & { version: string };

  export const RecycleScroller: Component<any, any, any, any>;
  export const DynamicScroller: Component<any, any, any, any>;
  export const DynamicScrollerItem: Component<any, any, any, any>;

  export function IdState(options?: {
    idProp?: (vm: any) => any;
  }): ComponentOptions<Vue> | typeof Vue;

  export default plugin;
}
