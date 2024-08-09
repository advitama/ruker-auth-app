import { fn } from "@storybook/test";
import { Checkbox } from "@/components/ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  component: Checkbox,
  title: "UI/Checkbox",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { onClick: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
      checked: false,
      defaultChecked: false,
      required: false,
      onCheckedChange: fn(),
  },
};
