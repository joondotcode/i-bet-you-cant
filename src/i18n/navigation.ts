// Since we're not using URL-based locale routing anymore,
// we can use regular Next.js navigation
export { 
  default as Link 
} from 'next/link';

export { 
  redirect,
  useRouter,
  usePathname 
} from 'next/navigation';

// For backward compatibility, but these are just regular Next.js now
export const getPathname = (path: string) => path;