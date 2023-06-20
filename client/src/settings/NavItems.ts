export interface NavItem {
    path: string;
    name: string;
}

export const navItems: NavItem[] = [
    // add or arrange nav items over here
    {
        path: '/camera',
        name: 'Camera',
    },
    {
        path: '/gallery',
        name: 'Gallery',
    },
];