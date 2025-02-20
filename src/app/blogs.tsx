import React from 'react';
import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);

const blogs = [
    {
        title: 'Understanding and Implementing the Workflow Component in Symfony',
        description:
            'The Workflow component in Symfony, focusing on managing object life-cycles within applications. It covers the basics of setting up and implementing the component, distinguishing between "Workflow" for complex processes and "State Machine" for linear processes.',
        href: 'https://medium.com/@vandetho/understanding-and-implementing-the-workflow-component-in-symfony-8b1764efa057',
    },
    {
        title: 'Implementing Workflow Component In Symfony With Multiple States Simultaneously',
        description:
            "This advanced tutorial dives into configuring and utilizing the workflow type 'workflow' as opposed to 'state_machine', showcasing a more dynamic approach suitable for non-linear processes.",
        href: 'https://medium.com/@vandetho/implementing-workflow-component-in-symfony-with-multiple-states-simultaneously-e553b82debbe',
    },
    {
        title: 'Implementing and Managing Events in Symfony Workflows',
        description:
            'A comprehensive guide on implementing and managing events within Symfony workflows. It serves as a sequel to an introductory article on the Symfony Workflow component, focusing on advanced workflow management through event handling.',
        href: 'https://medium.com/@vandetho/implementing-and-managing-events-in-symfony-workflows-f5f8b9372cc6',
    },
    {
        title: 'Simplifying Event Handling in Symfony Workflows with the Event Attribute (Symfony 7.1)',
        description:
            "A detailed guide on simplifying event handling in Symfony workflows with the 'event' attribute, introduced in Symfony 7.1. It covers the definition of events, the configuration of workflows, and practical examples of event handling within Symfony applications.",
        href: 'https://medium.com/@vandetho/simplifying-event-handling-in-symfony-workflows-with-the-event-attribute-symfony-7-1-052a3ded0f28',
    },
    {
        title: 'Understanding and Implementing the Symfony Workflow Component in Laravel.',
        description:
            'A detailed guide on integrating the Symfony Workflow component into Laravel applications, allowing for sophisticated workflow or state machine management. It covers the installation of the component, configuration of workflows including states and transitions, and practical implementation examples within a Laravel model.',
        href: 'https://medium.com/@vandetho/understanding-and-implementing-the-symfony-workflow-component-in-laravel-df5afbdff910',
    },
    {
        title: 'Creating a Custom Hydrator in Doctrine and Symfony for Enhanced Performance with DTOs',
        description:
            'The process of enhancing performance in Symfony applications by creating a custom hydrator in Doctrine for the efficient use of Data Transfer Objects (DTOs). It covers the definition of DTOs, the rationale behind using custom hydrators for DTO generation instead of loading complete entities, and provides a detailed step-by-step guide for implementation.',
        href: 'https://medium.com/@vandetho/creating-a-custom-hydrator-in-doctrine-and-symfony-for-enhanced-performance-with-dtos-f9f4fce8f035',
    },
];

interface BlogsProps {}

const Blogs = React.memo<BlogsProps>(() => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Blogs</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {blogs.map((component) => (
                                <ListItem key={component.title} title={component.title} href={component.href}>
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
});

export default Blogs;
