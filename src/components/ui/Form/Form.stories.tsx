import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta } from "@storybook/react-vite";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  parameters: {
    jest: "Form.test.tsx",
    layout: "centered",
    docs: {
      description: {
        component: `
# React Hook Form

Building forms with React Hook Form and Zod.

Forms are tricky. They are one of the most common things you'll build in a web application, but also one of the most complex.

Well-designed HTML forms are:

- **Well-structured and semantically correct.**
- **Easy to use and navigate (keyboard).**
- **Accessible with ARIA attributes and proper labels.**
- **Has support for client and server side validation.**
- **Well-styled and consistent with the rest of the application.**

In this guide, we will take a look at building forms with react-hook-form and zod. We're going to use a \`<FormField>\` component to compose accessible forms using Radix UI components.

## Features

The \`<Form />\` component is a wrapper around the react-hook-form library. It provides a few things:

- Composable components for building forms.
- A \`<FormField />\` component for building controlled form fields.
- Form validation using zod.
- Handles accessibility and error messages.
- Uses \`React.useId()\` for generating unique IDs.
- Applies the correct aria attributes to form fields based on states.
- Built to work with all Radix UI components.
- Bring your own schema library. We use zod but you can use anything you want.
- You have full control over the markup and styling.

## Required Props

### FormField (Required)
- **control**: Form control from react-hook-form useForm() hook
- **name**: String - Field name that matches your schema
- **render**: Function - Render prop that receives field props

### Form (Required)
- **Spread all useForm() methods**: \`{...form}\` where form = useForm()

### Other Components (Optional)
FormItem, FormLabel, FormControl, FormDescription, FormMessage have no required props but must be used within FormField context.

## Anatomy

\`\`\`tsx
<Form {...form}> {/* Required: spread useForm() result */}
  <FormField
    control={form.control} {/* Required */}
    name="fieldName"       {/* Required */}
    render={({ field }) => ( {/* Required */}
      <FormItem>
        <FormLabel />
        <FormControl>
          {/* Your form field */}
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      description: "Form content with FormField components",
      control: false,
    },
  },
  args: {
    children: "Form content goes here",
  },
  subcomponents: {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
  },
};

export default meta;

export const RequiredPropsDocumentation = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="font-semibold text-xl">Required Props Documentation</h2>

        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold text-lg">Form</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <code className="rounded bg-gray-100 px-2 py-1">...form</code> -
                Spread all useForm() methods (required)
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold text-lg">FormField</h3>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <code className="rounded bg-gray-100 px-2 py-1">control</code> -
                Form control from react-hook-form (required)
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1">name</code> -
                Field name string (required)
              </li>
              <li>
                <code className="rounded bg-gray-100 px-2 py-1">render</code> -
                Render function (required)
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold text-lg">Other Components</h3>
            <p>
              FormItem, FormLabel, FormControl, FormDescription, FormMessage:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>No required props</li>
              <li>Must be used within FormField context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Visual documentation showing all required props for Form components.",
      },
    },
  },
};

// Basic Input Form Example (Following shadcn/ui docs)
const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export const InputForm = {
  render: () => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        username: "",
      },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
      console.log(data);
    }

    return (
      <div className="w-96">
        <Form {...form}>
          <form
            className="w-2/3 space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="shadcn"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    );
  },
};

// Profile Form Example
const ProfileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

export const ProfileForm = {
  render: () => {
    const form = useForm<z.infer<typeof ProfileFormSchema>>({
      resolver: zodResolver(ProfileFormSchema),
      defaultValues: {
        username: "",
        email: "",
        bio: "",
        urls: [{ value: "" }],
      },
    });

    function onSubmit(data: z.infer<typeof ProfileFormSchema>) {
      console.log(data);
    }

    return (
      <div className="w-96">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="johndoe"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can manage email addresses in your email settings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us a little bit about yourself"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations
                    to link to them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update profile</Button>
          </form>
        </Form>
      </div>
    );
  },
};

// Checkbox Form Example
const CheckboxFormSchema = z.object({
  mobile: z.boolean().default(false).optional(),
  marketing: z.boolean().default(false).optional(),
  security: z.boolean(),
});

export const CheckboxForm = {
  render: () => {
    const form = useForm<z.infer<typeof CheckboxFormSchema>>({
      resolver: zodResolver(CheckboxFormSchema),
      defaultValues: {
        mobile: true,
        marketing: false,
        security: false,
      },
    });

    function onSubmit(data: z.infer<typeof CheckboxFormSchema>) {
      console.log(data);
    }

    return (
      <div className="w-96">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <h3 className="mb-4 font-medium text-lg">Email Notifications</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="marketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Marketing emails</FormLabel>
                        <FormDescription>
                          Receive emails about new products, features, and more.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mobile notifications</FormLabel>
                        <FormDescription>
                          Receive notifications on your mobile device.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="security"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Security emails</FormLabel>
                        <FormDescription>
                          Receive emails about your account security.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit">Update preferences</Button>
          </form>
        </Form>
      </div>
    );
  },
};

// Login Form Example
const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  rememberMe: z.boolean().default(false).optional(),
});

export const LoginForm = {
  render: () => {
    const form = useForm<z.infer<typeof LoginFormSchema>>({
      resolver: zodResolver(LoginFormSchema),
      defaultValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
    });

    function onSubmit(data: z.infer<typeof LoginFormSchema>) {
      console.log(data);
    }

    return (
      <div className="w-96">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Remember me</FormLabel>
                    <FormDescription>
                      Keep me signed in on this device
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    );
  },
};
