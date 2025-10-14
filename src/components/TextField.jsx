import { useId } from '@/hooks/useId';

import './TextField.css';

export const TextField = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  error = '',
  idTitle = 'title',
}) => {
  const id = useId();

  return (
    <fieldset className="field">
      <label htmlFor={`${id}-${idTitle}`} className="label">
        {label}
      </label>
      <input
        type={type}
        id={`${id}-${idTitle}`}
        className={`app_input ${error ? 'app_input--error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </fieldset>
  );
};
