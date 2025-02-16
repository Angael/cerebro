import { QueryScannedCode } from '@cerebro/server/src/routes/food/food.model';
import { Button, Group, Stack, TextInput, Title } from '@mantine/core';

type Props = {
  foodProduct: QueryScannedCode;
};

const SaveProductModal = (props: Props) => {
  return (
    <Stack>
      <Title order={5}>Quick add:</Title>
      <Group wrap="nowrap" justify="space-between">
        <Button size="xs" variant="light">
          10%
        </Button>
        <Button size="xs" variant="light">
          25%
        </Button>
        <Button size="xs" variant="light">
          50%
        </Button>
        <Button size="xs" variant="light">
          75%
        </Button>
        <Button size="xs" variant="light">
          100%
        </Button>
      </Group>

      <Group wrap="nowrap" justify="space-between">
        <Button size="xs" color="blue" variant="light">
          5g
        </Button>
        <Button size="xs" color="blue" variant="light">
          10g
        </Button>
        <Button size="xs" color="blue" variant="light">
          25g
        </Button>
        <Button size="xs" color="blue" variant="light">
          50g
        </Button>
        <Button size="xs" color="blue" variant="light">
          100g
        </Button>
      </Group>

      <Title order={5}>Precise add:</Title>
      <TextInput label="How much?" placeholder="100g" />
    </Stack>
  );
};

export default SaveProductModal;
