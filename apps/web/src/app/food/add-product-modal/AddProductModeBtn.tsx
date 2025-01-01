import { Text, UnstyledButton } from '@mantine/core';
import Icon from '@mdi/react';
import css from './AddProductModeBtn.module.css';
import CardBtn from '@/lib/card-btn/CardBtn';

type Props = {
  onClick: () => void;
  label: string;
  icon: string;
};

const AddProductModeBtn = ({ label, onClick, icon }: Props) => {
  return (
    <CardBtn className={css.btn} onClick={onClick}>
      <Icon path={icon} size={3} />
      <Text>{label}</Text>
    </CardBtn>
  );
};

export default AddProductModeBtn;
