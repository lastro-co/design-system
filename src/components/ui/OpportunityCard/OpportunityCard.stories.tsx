import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarIcon } from "@/components/icons";
import { OpportunityCard } from "./OpportunityCard";

const noop = () => {
  // intentional no-op for Storybook controls
};

const meta: Meta<typeof OpportunityCard> = {
  title: "Components/OpportunityCard",
  component: OpportunityCard,
  parameters: {
    jest: "OpportunityCard.test.tsx",
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    tagIcon: { control: false },
    primaryAction: { control: false },
    secondaryAction: { control: false },
    onDismiss: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof OpportunityCard>;

const remarketingDefaults = {
  tag: "Oportunidade",
  tagIcon: <StarIcon className="size-4" />,
  title: "Dispare um remarketing para 72 leads",
  description:
    "Você tem leads que não responderam nos últimos 7 dias. A Lais sugere um disparo em massa para eles.",
  primaryAction: { label: "Ir para Disparos", onClick: noop },
  secondaryAction: { label: "Depois", onClick: noop },
  onDismiss: noop,
};

export const Default: Story = {
  args: remarketingDefaults,
};

export const WithoutDismiss: Story = {
  args: {
    ...remarketingDefaults,
    onDismiss: undefined,
  },
};

export const WithoutSecondaryAction: Story = {
  args: {
    ...remarketingDefaults,
    secondaryAction: undefined,
  },
};

export const WithoutTagIcon: Story = {
  args: {
    ...remarketingDefaults,
    tagIcon: undefined,
  },
};

export const LongContent: Story = {
  args: {
    ...remarketingDefaults,
    title:
      "Dispare um remarketing para 248 leads e recupere oportunidades perdidas",
    description:
      "Você tem leads cadastrados há mais de 30 dias que ainda não foram contatados via remarketing. A Lais sugere um disparo em massa para reengajar esses contatos antes que eles esfriem ainda mais.",
  },
};
