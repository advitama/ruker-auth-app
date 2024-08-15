import { Label } from "@/components/ui/label";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  component: Label,
  title: "UI/Label",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label",
  },
};
