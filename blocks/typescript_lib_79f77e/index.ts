import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ in: {
  uuid: string;
  prefix: string
} }>;
type Outputs = Readonly<{ out: unknown }>;

export default async function(inputs: Inputs, context: Context) {
  console.log(inputs.in)
  context.sendMessage({
    uuid: inputs.in.uuid,
    prefix: inputs.in.prefix
  })
  context.done();
};