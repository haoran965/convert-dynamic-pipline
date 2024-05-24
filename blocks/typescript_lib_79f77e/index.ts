import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ uuid: string, prefix: string }>;
type Outputs = Readonly<{ out: unknown }>;

export default async function(inputs: Inputs, context: Context) {
  context.sendMessage({
    uuid: inputs.uuid,
    prefix: inputs.prefix
  })
  context.done();
};