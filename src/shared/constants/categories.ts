export const AD_CATEGORIES = [
    'Autos', 
    'Bienes', 
    'Empleos', 
    'Inmuebles',
    'Servicios',
    'Otro'
] as const;

export type AdCategoryType = typeof AD_CATEGORIES[number];