import React, { ComponentPropsWithoutRef, HTMLAttributes } from 'react';
import css from './Textfield.module.scss';
import { styled } from '../styled';

type Props = {
  label: string;
  input?: ComponentPropsWithoutRef<'input'>;
} & HTMLAttributes<HTMLLabelElement>;

const Label = styled('label', css.textfieldLabel);
const Input = styled('input', css.textfield);

const Textfield = ({ label, input, ...others }: Props) => {
  return (
    <Label {...others}>
      <span className={css.labelText}>{label}</span>
      <Input {...input} />
    </Label>
  );
};

export default Textfield;
