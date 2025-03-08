"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LayoutItem } from "@/components/LayoutSystem"
import useLowCodeStore from "@/hooks/useLowCodeStore"
import { Bot, Search } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function Navbar({
  name,
  layout,
  enableSearch,
  enableUser,
  enableFold,
  showLogo,
  mode,
}: {
  name: string;
  children: React.ReactNode;
  layout: React.CSSProperties;
  enableSearch: boolean;
  enableUser: boolean;
  enableFold: boolean;
  showLogo: boolean;
  mode: 'horizontal' | 'vertical';
}) {
  const routes = useLowCodeStore(state => state.expressionContext.routes);

  if (mode === 'horizontal') {

    return (
      <LayoutItem
        weightType='Navbar'
        layout={layout}
        weightId={name}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {showLogo && <Bot />}
            <NavigationMenu>
              <NavigationMenuList>
                {
                  Array.isArray(routes) && routes.map((route) => {
                    return (
                      <NavigationMenuItem key={route.pageId}>
                        <Link href={route.path || ''} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {route.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )
                  })
                }
              </NavigationMenuList>
            </NavigationMenu>
            {enableSearch && <Input className="rounded-full" placeholder="Search" />}
          </div>
          {enableUser && <Avatar className="w-8 h-8 bg-gray-200">U</Avatar>}
        </div>
      </LayoutItem>
    )
  }

  return (
    <LayoutItem
      weightType='Navbar'
      layout={layout}
      weightId={name}
    >
      <div className="flex flex-col items-center justify-between px-2">
        <div className="flex items-center gap-2">
          {showLogo && <Bot />}
          <NavigationMenu>
            <NavigationMenuList>
              {
                Array.isArray(routes) && routes.map((route) => {
                  return (
                    <NavigationMenuItem key={route.pageId}>
                      <Link href={route.path || ''} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          {route.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )
                })
              }
            </NavigationMenuList>
          </NavigationMenu>
          {enableSearch && <Input className="rounded-full" placeholder="Search" />}
        </div>
        {enableUser && <Avatar className="w-8 h-8 bg-gray-200">U</Avatar>}
      </div>
    </LayoutItem>
  )
}
