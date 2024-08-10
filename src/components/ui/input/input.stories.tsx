import { Input } from "@/components/ui/input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  component: Input,
  title: "UI/Input",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "This component is using InputHTMLAttributes ",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
