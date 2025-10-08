import { useId } from '@/hooks/useId';

import './CheckBoxField.css';

export const CheckboxField = ({ label, checked, onChange, idTitle }) => {
  const id = useId();

  return (
    <fieldset className="field">
      <label htmlFor={`${id}-${idTitle}`} className="label">
        {label}
      </label>
      <div>
        <input
          id={`${id}-${idTitle}`}
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
      </div>
    </fieldset>
  );
};
