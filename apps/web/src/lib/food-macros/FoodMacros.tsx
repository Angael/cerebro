import { Progress } from '@mantine/core';

type Props = {
  carbs: number;
  proteins: number;
  fats: number;
} & React.ComponentProps<typeof Progress.Root>;

const FoodMacros = ({ carbs, proteins, fats, ...otherProps }: Props) => {
  const other = 100 - carbs - proteins - fats;

  return (
    <Progress.Root size="xl" {...otherProps}>
      <Progress.Section value={carbs} color="cyan">
        <Progress.Label>Carbs</Progress.Label>
      </Progress.Section>
      <Progress.Section value={proteins} color="pink">
        <Progress.Label>Proteins</Progress.Label>
      </Progress.Section>
      <Progress.Section value={fats} color="yellow">
        <Progress.Label>Fats</Progress.Label>
      </Progress.Section>
      <Progress.Section value={other} color="gray">
        <Progress.Label>Others</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
};

export default FoodMacros;
