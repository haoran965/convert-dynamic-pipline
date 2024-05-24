import type { VocanaSDK } from "@oomol/oocana-sdk";

type Context = VocanaSDK<Inputs, Outputs>;
type Inputs = Readonly<{ url: string, netless_token: string }>;
type Outputs = Readonly<{ uuid: string, netless_token: string }>;



async function createDynamicConvert(resource: string, token: string) {
    const res = await fetch("https://api.netless.link/v5/projector/tasks", {
        method: "POST",
        body: JSON.stringify({
            resource,
            preview: true,
            type: "dynamic"
        }),
        headers: {
            token,
            // region: "us-sv",
            "Content-Type": "application/json",
        }
    })
    return res;
}

export default async function(inputs: Inputs, context: Context) {
    const token = inputs.netless_token;
    const url = inputs.url;
    createDynamicConvert(url, token).then(async res => {
      const data = await res.json();
      const { uuid, type, status } = data;
      // const task = await getConvertProgress(uuid, token);
      // console.log(task, "task");
      void context.output(uuid, "uuid", true);
      void context.output(token, "netless_token", true);
    }).catch(e => {
      throw e
    })
};