export interface Haticon {
  class: string;
  name: string;
  content: string;
  category: string;
}

export interface CategoryInfo {
  name: string;
  description: string;
}

export declare const icons: Haticon[];
export declare const categories: Record<string, CategoryInfo>;
export declare const aliases: Record<string, string>;
export declare function getIcon(className: string): Haticon | undefined;
export declare function getByCategory(category: string): Haticon[];

declare const _default: {
  icons: Haticon[];
  categories: Record<string, CategoryInfo>;
  aliases: Record<string, string>;
  getIcon: (className: string) => Haticon | undefined;
  getByCategory: (category: string) => Haticon[];
};
export default _default;
