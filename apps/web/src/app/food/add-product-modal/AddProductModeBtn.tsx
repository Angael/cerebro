import { Text, UnstyledButton } from '@mantine/core';
import Icon from '@mdi/react';
import css from './AddProductModeBtn.module.css';

type Props = {
  onClick: () => void;
  label: string;
  icon: string;
};

const AddProductModeBtn = ({ label, onClick, icon }: Props) => {
  return (
    <UnstyledButton className={css.btn} onClick={onClick}>
      <Icon path={icon} size={3} />
      <Text>{label}</Text>
    </UnstyledButton>
  );
};

export default AddProductModeBtn;
