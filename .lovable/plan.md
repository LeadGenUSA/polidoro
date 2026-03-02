

## Prevent Self-Revocation and Add Confirmation Dialog

### Changes

**File: `src/components/admin/UserRolesManager.tsx`**

1. Import `useAuth` hook to get the current user's ID.
2. Import `AlertDialog` components from the UI library.
3. Add state to track which role ID is pending deletion (for the confirmation dialog).
4. In the admin list, hide the delete button (or disable it) when the role's `user_id` matches the current logged-in user, preventing self-revocation.
5. For other admins, clicking the trash icon opens a confirmation dialog instead of immediately revoking. The dialog will display the target admin's email and require explicit confirmation before proceeding.

### Technical Details

- Use `useAuth()` to get `user.id` and compare against each `role.user_id`.
- Use the existing `AlertDialog` component (`src/components/ui/alert-dialog.tsx`) for the confirmation prompt.
- Store the selected role ID in local state (`roleToRevoke`). On confirm, call `revokeAdmin.mutate(roleToRevoke)` and clear the state.
- The self-revocation button will be hidden entirely (not just disabled) to keep the UI clean.

