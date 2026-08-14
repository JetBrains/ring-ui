# Forms and feedback

Use a native `<form>` as the composition root. Ring UI supplies controls and feedback surfaces; React owns the saved snapshot, draft, validation, submission, and result states.

The example and consumer imports use `@jetbrains/ring-ui-built`.

## Contents

- [Complete controlled settings form](#complete-controlled-settings-form)
- [Form-state rules](#form-state-rules)
- [Page-state decisions](#page-state-decisions)

## Complete controlled settings form

`project-settings-form.tsx`:

```tsx
import {useState, type FormEvent} from 'react';
import Banner from '@jetbrains/ring-ui-built/components/banner/banner';
import Button from '@jetbrains/ring-ui-built/components/button/button';
import ButtonSet from '@jetbrains/ring-ui-built/components/button-set/button-set';
import ControlLabel from '@jetbrains/ring-ui-built/components/control-label/control-label';
import Input from '@jetbrains/ring-ui-built/components/input/input';
import Select, {type SelectItem} from '@jetbrains/ring-ui-built/components/select/select';
import Toggle from '@jetbrains/ring-ui-built/components/toggle/toggle';

import styles from './project-settings-form.module.css';

type Visibility = 'private' | 'team' | 'public';

type VisibilityData = {
  value: Visibility;
};

type Settings = {
  name: string;
  visibility: Visibility;
  notifications: boolean;
};

type ProjectSettingsFormProps = {
  initialValue: Settings;
  onSave: (value: Settings) => Promise<void>;
};

const VISIBILITY_OPTIONS: SelectItem<VisibilityData>[] = [
  {key: 'private', label: 'Private', value: 'private'},
  {key: 'team', label: 'Team', value: 'team'},
  {key: 'public', label: 'Public', value: 'public'},
];

const NAME_ID = 'project-settings-name';
const NAME_HELP_ID = 'project-settings-name-help';
const NAME_ERROR_ID = 'project-settings-name-error';
const VISIBILITY_ID = 'project-settings-visibility';
const NOTIFICATIONS_ID = 'project-settings-notifications';

export function ProjectSettingsForm({initialValue, onSave}: ProjectSettingsFormProps) {
  const [saved, setSaved] = useState(initialValue);
  const [draft, setDraft] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const nameError = draft.name.trim() ? null : 'Project name is required.';
  const dirty =
    draft.name !== saved.name ||
    draft.visibility !== saved.visibility ||
    draft.notifications !== saved.notifications;
  const selectedVisibility =
    VISIBILITY_OPTIONS.find(option => option.value === draft.visibility) ?? null;

  const updateDraft = (next: Settings) => {
    setDraft(next);
    setSavedMessage(null);
    setSaveError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setShowErrors(true);
    setSavedMessage(null);
    setSaveError(null);
    if (nameError) return;

    const next = {...draft, name: draft.name.trim()};
    setSubmitting(true);
    try {
      await onSave(next);
      setSaved(next);
      setDraft(next);
      setShowErrors(false);
      setSavedMessage('Project settings saved.');
    } catch {
      setSaveError('Could not save project settings. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDraft(saved);
    setShowErrors(false);
    setSavedMessage(null);
    setSaveError(null);
  };

  const nameDescribedBy =
    showErrors && nameError ? `${NAME_HELP_ID} ${NAME_ERROR_ID}` : NAME_HELP_ID;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {saveError && (
        <div role="alert">
          <Banner mode="error" withIcon>
            {saveError}
          </Banner>
        </div>
      )}
      {savedMessage && (
        <div role="status">
          <Banner mode="success" withIcon>
            {savedMessage}
          </Banner>
        </div>
      )}

      <div className={styles.field}>
        <Input
          id={NAME_ID}
          label="Project name"
          value={draft.name}
          required
          disabled={submitting}
          aria-invalid={showErrors && Boolean(nameError)}
          aria-describedby={nameDescribedBy}
          error={showErrors && nameError ? '' : undefined}
          onChange={event => updateDraft({...draft, name: event.currentTarget.value})}
        />
        <p id={NAME_HELP_ID} className={styles.help}>
          Shown in project navigation and search.
        </p>
        {showErrors && nameError && (
          <p id={NAME_ERROR_ID} className={styles.error}>
            {nameError}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <Select<VisibilityData>
          id={VISIBILITY_ID}
          data={VISIBILITY_OPTIONS}
          selected={selectedVisibility}
          selectedLabel="Visibility"
          label="Choose visibility"
          disabled={submitting}
          onChange={(option: SelectItem<VisibilityData> | null) => {
            if (option) updateDraft({...draft, visibility: option.value});
          }}
        />
        <p className={styles.help}>Controls who can discover and open this project.</p>
      </div>

      <div className={styles.toggleField}>
        <ControlLabel htmlFor={NOTIFICATIONS_ID} disabled={submitting}>
          Email notifications
        </ControlLabel>
        <Toggle
          id={NOTIFICATIONS_ID}
          checked={draft.notifications}
          disabled={submitting}
          onChange={event => updateDraft({...draft, notifications: event.currentTarget.checked})}
        />
      </div>

      {dirty && (
        <ButtonSet className={styles.actions}>
          <Button primary type="submit" loader={submitting} disabled={submitting}>
            Save
          </Button>
          <Button type="button" disabled={submitting} onClick={handleCancel}>
            Cancel
          </Button>
        </ButtonSet>
      )}
    </form>
  );
}
```

`project-settings-form.module.css`:

```css
.form {
  display: grid;
  width: min(100%, calc(var(--ring-unit) * 75));
  gap: calc(var(--ring-unit) * 3);
}

.field {
  display: grid;
  gap: calc(var(--ring-unit) / 2);
  min-width: 0;
}

.help,
.error {
  margin: 0;
  font-size: var(--ring-font-size-smaller);
  line-height: var(--ring-line-height-lowest);
}

.help {
  color: var(--ring-secondary-color);
}

.error {
  color: var(--ring-error-color);
}

.toggleField {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(var(--ring-unit) * 2);
  padding-block: var(--ring-unit);
}

.actions {
  padding-block-start: calc(var(--ring-unit) * 2);
  border-block-start: 1px solid var(--ring-line-color);
}
```

## Form-state rules

- Keep persisted `saved` data separate from editable `draft`. Derive validity, dirty state, and the selected `SelectItem` instead of storing duplicates.
- React only uses `initialValue` for the first `useState` call. If the mounted form can switch records or receive a server refresh, resynchronize `saved` and `draft` from a stable record ID/version. Decide explicitly whether a dirty draft wins, is discarded, or requires confirmation; do not reset on every new object reference.
- Add an unsaved-navigation guard when leaving the route, closing a sidebar, or dismissing a dialog could destroy a dirty draft. Remove the guard after save or cancel.
- Keep field rules close to their derived errors. Reveal errors on submit or blur, retain persistent help, connect all help/error IDs with `aria-describedby`, and move focus to the first invalid field when long forms can fail off-screen.
- Prevent duplicate submission in both the handler and controls. While saving, propagate `disabled` to every editable control, external label/help action, Save, Cancel, and dependent section; use the primary button's `loader` for local progress.
- Put actions after page fields for ordinary pages, in the owning sidebar's sticky/footer region for sidebar editors, and in the dialog action area for dialogs. Keep them inside the native form so Enter submits predictably.

## Page-state decisions

| State | Use | Accessibility and behavior |
| --- | --- | --- |
| Blocking loading | `LoaderScreen` in the main region | Give the region `role="status"` and an accessible loading name; replace it with content when ready. |
| Local loading | `LoaderInline` beside the affected section/control | Name the local status; keep unrelated content and actions usable. |
| Background loading | Subtle inline progress only when users need it | Do not block the page or repeatedly announce silent refreshes. |
| Initial empty | Purpose, short explanation, and primary creation/setup action | Distinguish absence of data from an error. |
| Filtered empty | “No matches” plus clear/change-filter action | Preserve the user's data and current filter context. |
| Contextual risk | Persistent warning/error `Banner` near the affected controls | Use `role="alert"` only when immediate interruption is warranted. |
| Success | `Banner` or message in `role="status"` near the saved region | Confirm the completed action without moving focus. |
| Retryable failure | Error `Banner` in `role="alert"` with a retry path | Preserve the draft, stop the loader, and re-enable controls. |

Avoid uncontrolled forms that also maintain a shared saved snapshot, untyped `Select` values or guessed primitive selections, duplicate submission paths, inaccessible labels/help, conflating first-use and filtered empty states, and transient alerts as a replacement for persistent field validation.
