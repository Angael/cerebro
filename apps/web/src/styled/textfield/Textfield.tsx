import React, { ComponentPropsWithoutRef, HTMLAttributes } from 'react';
import css from './Textfield.module.scss';
import { styled } from '../styled';

type Props = {
  label: string;
  input?: ComponentPropsWithoutRef<'input'>;
  error?: string | null;
} & HTMLAttributes<HTMLLabelElement>;

const Label = styled('label', css.textfieldLabel);
const Input = styled('input', css.textfield);

const Textfield = ({ label, input, error, ...others }: Props) => {
  return (
    <Label {...others}>
      <span className={css.labelText}>{label}</span>
      <Input {...input} className={error ? css.error : undefined} />
      {error && <p className="body2 error">{error}</p>}
    </Label>
  );
};

export default Textfield;
