import { DesignResource, User, UserRole } from "../types";

const KEYS = {
  USERS: 'designi_clone_users',
  RESOURCES: 'designi_clone_resources',
  CURRENT_USER: 'designi_clone_current_user',
};

// Seed Data
const seedResources: DesignResource[] = [
  {
    id: '1',
    title: 'Social Media Post - Burger',
    description: 'Template profissional para hamburgueria artesanal.',
    thumbnailData: 'https://picsum.photos/400/400?random=1',
    psdFileName: 'burger_social.psd',
    uploadDate: new Date().toISOString(),
    authorId: 'admin',
    tags: ['social media', 'food', 'burger'],
    downloads: 120,
    isPremium: true
  },
  {
    id: '2',
    title: 'Flyer Evento Musical',
    description: 'Cartaz para festas e eventos noturnos.',
    thumbnailData: 'https://picsum.photos/400/500?random=2',
    psdFileName: 'music_flyer.psd',
    uploadDate: new Date().toISOString(),
    authorId: 'admin',
    tags: ['evento', 'musica', 'flyer'],
    downloads: 45,
    isPremium: false
  },
  {
    id: '3',
    title: 'Cartão de Visita Minimalista',
    description: 'Design limpo e corporativo para advogados.',
    thumbnailData: 'https://picsum.photos/400/300?random=3',
    psdFileName: 'business_card.psd',
    uploadDate: new Date().toISOString(),
    authorId: 'admin',
    tags: ['corporativo', 'minimalista', 'business'],
    downloads: 330,
    isPremium: true
  }
];

const seedAdmin: User = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@designi.com',
  phone: '(00) 00000-0000',
  role: UserRole.ADMIN
};

// Helpers
export const getUsers = (): User[] => {
  const stored = localStorage.getItem(KEYS.USERS);
  return stored ? JSON.parse(stored) : [seedAdmin];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getResources = (): DesignResource[] => {
  const stored = localStorage.getItem(KEYS.RESOURCES);
  return stored ? JSON.parse(stored) : seedResources;
};

export const saveResource = (resource: DesignResource) => {
  const resources = getResources();
  // Prepend to show newest first
  const updated = [resource, ...resources];
  localStorage.setItem(KEYS.RESOURCES, JSON.stringify(updated));
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(KEYS.CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const authenticateUser = (email: string, phone: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email === email && u.phone === phone);
};
