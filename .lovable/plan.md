

## Enforce Minimum 1 Admin via Database Trigger

### Overview
Add a database trigger on the `user_roles` table that prevents deleting the last remaining admin role. This provides server-side protection that cannot be bypassed, complementing the existing client-side self-revocation guard.

### Changes

**1. Database Migration: Create a validation trigger**
- Create a function `prevent_last_admin_deletion()` that runs BEFORE DELETE on `user_roles`
- The function counts remaining admin roles; if only 1 remains and it's the one being deleted, it raises an exception
- This protects against all deletion paths: client UI, direct database access, or API calls

```text
DELETE attempt on user_roles
        |
  [BEFORE DELETE trigger]
        |
  Count admin roles remaining
        |
  If this is the last one --> RAISE EXCEPTION
  Otherwise              --> Allow deletion
```

**2. Update `UserRolesManager.tsx` client-side**
- Catch the specific error message from the trigger in the `revokeAdmin` mutation's `onError` handler
- Display a user-friendly toast: "Cannot remove the last admin. At least one admin must exist."

### Technical Details

- The trigger uses `SECURITY DEFINER` to bypass RLS when counting admin roles
- The error message from Postgres will contain a identifiable string (e.g., "Cannot delete the last admin") that the client can detect
- No changes to existing RLS policies are needed
- The trigger only fires on DELETE, so granting new admin roles is unaffected

