<script setup lang="ts">
const route = useRoute();

const routeArray = computed(() => route.path.split('/').filter(Boolean) || []);

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            plan: 'Free',
        },
    ],
    navMain: [
        {
            title: 'Playground',
            url: '#',
            icon: 'mdi:tab',
            isActive: true,
            items: [
                {
                    title: 'History',
                    url: '#',
                },
                {
                    title: 'Starred',
                    url: '#',
                },
                {
                    title: 'Settings',
                    url: '#',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: 'mdi:tab',
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                    isActive: true,
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: 'mdi:tab',
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: 'mdi:tab',
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: 'mdi:abacus',
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: 'mdi:abacus',
        },
        {
            name: 'Travel',
            url: '#',
            icon: 'mdi:abacus',
        },
    ],
}

const activeTeam = ref(data.teams[0])

function setActiveTeam(team: typeof data.teams[number]) {
    activeTeam.value = team
}

const colorMode = useColorMode()
let mode = colorMode.value;

const toggleColorMode = () => {
    if (mode === 'light') {
        colorMode.preference = 'dark';
        mode = 'dark';
    } else {
        colorMode.preference = 'light';
        mode = 'light';
    }
}
</script>

<template>
    <SidebarProvider>
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div class="flex items-center gap-4">
                            <Icon name="mdi:school" class="size-8 text-primary aspect-square" />
                            <div class="grid">
                                <span class="text-lg font-semibold truncate leading-tight">School & Feedback</span>
                                <span class="text-sm text-primary-foreground/70 truncate leading-tight">Admin Panel</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible v-for="item in data.navMain" :key="item.title" as-child
                            :default-open="item.isActive" class="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger as-child>
                                    <SidebarMenuButton :tooltip="item.title">
                                        <Icon :name="item.icon" />
                                        <span>{{ item.title }}</span>
                                        <Icon name="mdi:chevron-right"
                                            class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                                            <SidebarMenuSubButton as-child :is-active="true">
                                                <a :href="subItem.url">
                                                    <span>{{ subItem.title }}</span>
                                                </a>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup class="group-data-[collapsible=icon]:hidden">
                    <SidebarGroupLabel>Projects</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in data.projects" :key="item.name">
                            <SidebarMenuButton as-child :tooltip="'testikus'">
                                <a :href="item.url">
                                    <Icon :name="item.icon" />
                                    <span>{{ item.name }}</span>
                                </a>
                            </SidebarMenuButton>
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <SidebarMenuAction show-on-hover>
                                        <Icon name="mdi:dots-vertical" />
                                        <span class="sr-only">More</span>
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent class="w-48 rounded-lg" side="bottom" align="end">
                                    <DropdownMenuItem>
                                        <Icon name="mdi:eye" />
                                        <span>View Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Icon name="mdi:share-variant" />
                                        <span>Share Project</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Icon name="mdi:delete" />
                                        <span>Delete Project</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton class="text-sidebar-foreground/70">
                                <Icon name="mdi:plus" />
                                <span>More</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger as-child>
                                <SidebarMenuButton size="lg"
                                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <Avatar class="h-8 w-8 rounded-lg">
                                        <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                                        <AvatarFallback class="rounded-lg">
                                            CN
                                        </AvatarFallback>
                                    </Avatar>
                                    <div class="grid flex-1 text-left text-sm leading-tight">
                                        <span class="truncate font-semibold">{{ data.user.name }}</span>
                                        <span class="truncate text-xs">{{ data.user.email }}</span>
                                    </div>
                                    <ChevronsUpDown class="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom" align="end" :side-offset="4">
                                <DropdownMenuLabel class="p-0 font-normal">
                                    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar class="h-8 w-8 rounded-lg">
                                            <AvatarImage :src="data.user.avatar" :alt="data.user.name" />
                                            <AvatarFallback class="rounded-lg">
                                                CN
                                            </AvatarFallback>
                                        </Avatar>
                                        <div class="grid flex-1 text-left text-sm leading-tight">
                                            <span class="truncate font-semibold">{{ data.user.name }}</span>
                                            <span class="truncate text-xs">{{ data.user.email }}</span>
                                        </div>
                                    </div>
                                    <Icon name="mdi:chevron-down" class="ml-auto" />
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Icon name="mdi:account" />
                                        Upgrade to Pro
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Icon name="mdi:account" />
                                        Account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Icon name="mdi:bell" />
                                        Billing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Icon name="mdi:bell" />
                                        Notifications
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click.stop.prevent="toggleColorMode">
                                        <Icon :name="mode === 'light' ? 'mdi:weather-night' : 'mdi:weather-sunny'" />
                                        {{ mode === 'light' ? 'Dark Mode' : 'Light Mode' }}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Icon name="mdi:logout" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
        <SidebarInset>
            <header
                class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div class="flex items-center gap-2 px-4">
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 h-5" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <template v-for="(item, index) in routeArray.slice(0, -1)">
                                <BreadcrumbItem>
                                    <BreadcrumbLink :href="`/${item}`">
                                        {{ item }}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator v-if="index < routeArray.length - 1" />
                            </template>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {{ routeArray[routeArray.length - 1] ?? 'Home' }}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <main class="flex-none p-4 pt-0">
                <slot />
            </main>
        </SidebarInset>
    </SidebarProvider>
</template>