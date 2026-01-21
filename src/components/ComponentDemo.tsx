import { useState } from 'react';
import {
  Button,
  Input,
  Select,
  DatePicker,
  FileUpload,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Grid,
  GridItem,
  Flex,
  Container,
  Stack,
  HStack
} from './ui';

export function ComponentDemo() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [dateValue, setDateValue] = useState('');

  const selectOptions = [
    { value: 'gold', label: 'Gold 24k' },
    { value: 'silver', label: 'Silver 925' },
    { value: 'platinum', label: 'Platinum' }
  ];

  return (
    <Container size="xl" padding="lg">
      <Stack spacing="xl">
        {/* Theme Selector */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Theme Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Professional theme is active</p>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={3} gap="md">
              <GridItem>
                <Stack spacing="sm">
                  <Button variant="primary" size="sm">Primary Small</Button>
                  <Button variant="primary" size="md">Primary Medium</Button>
                  <Button variant="primary" size="lg">Primary Large</Button>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack spacing="sm">
                  <Button variant="secondary" size="sm">Secondary Small</Button>
                  <Button variant="secondary" size="md">Secondary Medium</Button>
                  <Button variant="secondary" size="lg">Secondary Large</Button>
                </Stack>
              </GridItem>
              <GridItem>
                <Stack spacing="sm">
                  <Button variant="tertiary" size="sm">Tertiary Small</Button>
                  <Button variant="tertiary" size="md">Tertiary Medium</Button>
                  <Button variant="tertiary" size="lg">Tertiary Large</Button>
                </Stack>
              </GridItem>
            </Grid>
            <HStack spacing="md" className="mt-4">
              <Button loading>Loading Button</Button>
              <Button disabled>Disabled Button</Button>
            </HStack>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg">
              <GridItem>
                <Stack spacing="md">
                  <Input
                    label="Floating Label Input"
                    variant="floating"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter text..."
                  />
                  <Input
                    label="Standard Input"
                    variant="standard"
                    helperText="This is helper text"
                  />
                  <Select
                    label="Metal Type"
                    options={selectOptions}
                    value={selectValue}
                    onChange={setSelectValue}
                    searchable
                    placeholder="Select metal type..."
                  />
                </Stack>
              </GridItem>
              <GridItem>
                <Stack spacing="md">
                  <DatePicker
                    label="Due Date"
                    value={dateValue}
                    onChange={setDateValue}
                    placeholder="Select due date..."
                  />
                  <FileUpload
                    label="Upload Documents"
                    accept=".pdf,.jpg,.png"
                    multiple
                    helperText="Upload product images or specifications"
                  />
                </Stack>
              </GridItem>
            </Grid>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Card Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={4} gap="md">
              <GridItem>
                <Card variant="default" padding="md">
                  <CardTitle as="h4">Default Card</CardTitle>
                  <CardContent>
                    <p className="text-sm opacity-75">This is a default card variant.</p>
                  </CardContent>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="elevated" padding="md" hoverable>
                  <CardTitle as="h4">Elevated Card</CardTitle>
                  <CardContent>
                    <p className="text-sm opacity-75">This is an elevated card with hover effect.</p>
                  </CardContent>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="outlined" padding="md" hoverable>
                  <CardTitle as="h4">Outlined Card</CardTitle>
                  <CardContent>
                    <p className="text-sm opacity-75">This is an outlined card variant.</p>
                  </CardContent>
                </Card>
              </GridItem>
              <GridItem>
                <Card variant="glass" padding="md">
                  <CardTitle as="h4">Glass Card</CardTitle>
                  <CardContent>
                    <p className="text-sm opacity-75">This is a glass morphism card.</p>
                  </CardContent>
                </Card>
              </GridItem>
            </Grid>
          </CardContent>
        </Card>

        {/* Layout Components */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Layout Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack spacing="lg">
              <div>
                <h4 className="font-medium mb-4">Flex Layout</h4>
                <Flex justify="between" align="center" className="p-4 bg-slate-100 rounded-lg">
                  <span>Left Content</span>
                  <span>Center Content</span>
                  <span>Right Content</span>
                </Flex>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">Stack Layout</h4>
                <HStack spacing="md" className="p-4 bg-orange-100 rounded-lg">
                  <div className="px-3 py-1 bg-slate-800 text-white rounded-lg text-sm">Item 1</div>
                  <div className="px-3 py-1 bg-slate-800 text-white rounded-lg text-sm">Item 2</div>
                  <div className="px-3 py-1 bg-slate-800 text-white rounded-lg text-sm">Item 3</div>
                </HStack>
              </div>
            </Stack>
          </CardContent>
          <CardFooter>
            <p className="text-sm opacity-75">
              All components adapt to the selected theme automatically.
            </p>
          </CardFooter>
        </Card>
      </Stack>
    </Container>
  );
}