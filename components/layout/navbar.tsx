'use client';

// import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { buttonVariants } from '../common/button';
import { LogIn } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../common/dropdown-menu';
import UserAvatar from '../common/user-avatar';
import { ShopSwitcher } from '@/features/shop/components/shop-switcher';
import useShop from '@/features/shop/hooks/use-shop';

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();
  const shopUser = session?.user;
  const routes = [
    {
      href: `/${params.shopId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.shopId}/settings`,
    },
  ];

  const { shops } = useShop();

  return (
    <nav className='border-b'>
      <div className='flex h-16 items-center gap-3'>
        <ShopSwitcher items={shops} />
        <div className={cn('flex items-center gap-3')}>
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.label}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                route?.active
                  ? 'text-black dark:text-white'
                  : 'text-muted-foreground'
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          {/* <UserButton afterSignOutUrl='/' /> */}
          {shopUser ? (
            <div
              className={buttonVariants(false)({
                size: 'icon',
                variant: 'ghost',
              })}
            >
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <UserAvatar
                    className='h-5 w-5'
                    user={{
                      name: shopUser?.name || null,
                      image: shopUser?.image || null,
                    }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      signOut();
                    }}
                    className='cursor-pointer'
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link href='/sign-in'>
              <div
                className={buttonVariants(false)({
                  size: 'icon',
                  variant: 'ghost',
                })}
              >
                <LogIn className='h-4 w-4 lg:h-5 lg:w-5' />
                <span className='sr-only'>Sign In</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
