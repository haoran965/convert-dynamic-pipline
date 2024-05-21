import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ in: unknown }>;
type Outputs = Readonly<{ out: unknown }>;

export default async function(inputs: Inputs, context: Context) {
  context.sendMessage("renderSlide")
};