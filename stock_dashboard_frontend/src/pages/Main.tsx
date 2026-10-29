import { Button, Container, Group, Text } from '@mantine/core';

import classes from './Main.module.css';

function Main() {
  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          A simple {' '}
          <Text component="span" variant="gradient" gradient={{ from: 'purple', to: 'cyan' }} inherit>
            Stock 
          </Text>{' '}
          Visualizer 
        </h1>

        <Text className={classes.description} c="dimmed">
          This is a simple to use market dashboard, search for the dashboard you want & 
          live data starts streaming into the chart 
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'purple', to: 'cyan' }}
          >
            Get started
          </Button>

          <Button
            component="a"
            href="https://github.com/Conspiciens"
            size="xl"
            variant="default"
            className={classes.control}
          >
            GitHub
          </Button>
        </Group>
      </Container>
    </div>
  );
}

export default Main; 