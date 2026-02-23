
## Fix: Allow Admins to View All Profiles

### The Problem

The `profiles` table only has a policy "Users can view their own profile" (`auth.uid() = user_id`). When an admin tries to grant rights by email, the `UserRolesManager` component queries `profiles` to find the target user, but the policy blocks the admin from seeing anyone else's profile. This causes the "No user found with that email" error.

### The Fix

Add a new database security policy that allows admins to read all profiles. This is needed for the User Roles Manager to function.

### Changes

**1. Database migration** -- Add RLS policy on `profiles`:

```sql
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
```

That's it -- one policy addition, no code changes needed. The existing `UserRolesManager` component will work as-is once admins can read all profile rows.

### File Changed

- Database only (new RLS policy on `profiles` table)
